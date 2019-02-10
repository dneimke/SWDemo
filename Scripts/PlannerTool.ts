import { ApplicationDataAgent } from "./Data/data-agent";
let ko = require('knockout') as KnockoutStatic;

export class PlannerTool {

    private _plannerContainer: HTMLElement;
    private _createButton: HTMLButtonElement;
    private _saveButton: HTMLButtonElement;
    private _state: ToolState;
    private _agent: ApplicationDataAgent = new ApplicationDataAgent();

    private _dialog: CompletePlanDialog;

    constructor() {
        this._plannerContainer = document.getElementById('planner-tool');
        this._createButton = document.getElementById('create-plan') as HTMLButtonElement;
        this._saveButton = document.getElementById('save-plan') as HTMLButtonElement;
        this._state = new ToolState();
        this._dialog = new CompletePlanDialog();
    }

    init() {

        ko.applyBindings(this._state, this._plannerContainer);

        let that = this;
        this._createButton.addEventListener('click', function (e: Event) {
            that._state.isNew(false);
        });


        this._saveButton.addEventListener('click', async function (e: Event) {

            let tasks = that._state.tasks() as string[];
            let result = await that._dialog.show(tasks);

            if (result.result === true) {
                that._agent.save(result.name, tasks);
                that._state.reset();
            }

            that._dialog.hide();
        });
    }
}


class ToolState {
    isNew = ko.observable(true);
    task = ko.observable('');
    tasks = ko.observableArray();
    canSave = ko.observable(false);
    hasOfflineData = ko.observable(false);

    private _agent: ApplicationDataAgent = new ApplicationDataAgent();

    constructor() {
        this._agent.hasOfflineData().then(result => {
            this.hasOfflineData(result);
        });
    }

    isOnline() {
        return navigator.onLine;
    }

    reset() {
        this.isNew(true);
        this.task('');
        this.tasks.removeAll();
        this.canSave(false);
        this._agent.hasOfflineData().then(result => {
            this.hasOfflineData(result);
        });
    }

    addTask(): void {
        const t = this.task();
        this.tasks.push(t);
        this.task('');

        const canSave = this.tasks().length > 0;
        this.canSave(canSave);
    }
}


class DialogState {
    isOffline = ko.observable(false);
    tasks = ko.observableArray();

    changeTasks(tasks: string[]) {
        this.tasks.removeAll();
        tasks.forEach(t => this.tasks.push(t));
    }
}

export interface CompletePlanDialogResult {
    name: string;
    result: boolean;
}



class CompletePlanDialog {

    private _dfd: JQueryDeferred<CompletePlanDialogResult>;

    private _dialogSelector = 'save-dialog';
    private _contentSelector = 'dialog-content';
    private _saveSelector = 'save-button';

    private _saveButton: HTMLButtonElement;
    private _dialogElement: HTMLElement;
    private _dialogContentContainer: HTMLElement;
    private _dialogState: DialogState = new DialogState();

    constructor() {
        let that = this;

        this._dialogElement = document.getElementById(this._dialogSelector);
        this._dialogContentContainer = document.getElementById(this._contentSelector);
        this._saveButton = document.getElementById(this._saveSelector) as HTMLButtonElement;
        ko.applyBindings(this._dialogState, this._dialogContentContainer);

        $(this._dialogElement).on('hidden.bs.modal', function (e) {
            that._dfd.resolve({ name: '', result: false });
        });

        this._saveButton.addEventListener("click", (e) => {
            that._dfd.resolve({ name: new Date().getMilliseconds().toString(), result: true });
        });
    }

    show(tasks: string[]): JQueryPromise<CompletePlanDialogResult> {
        this._dfd = $.Deferred<CompletePlanDialogResult>();
        this._dialogState.changeTasks(tasks);
        $(this._dialogElement).modal('show');
        return this._dfd.promise();
    }

    hide(): void {
        $(this._dialogElement).modal('hide');
    }
}

