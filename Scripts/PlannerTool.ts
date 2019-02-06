let ko = require('knockout') as KnockoutStatic;

export class PlannerTool {

    private _plannerContainer: HTMLElement;
    private _createButton: HTMLButtonElement;
    private _saveButton: HTMLButtonElement;
    private _saveDialog: HTMLElement;
    private _state: ToolState;

    constructor() {
        this._plannerContainer = document.getElementById('planner-tool');
        this._saveDialog = document.getElementById('save-dialog');
        this._createButton = document.getElementById('create-plan') as HTMLButtonElement;
        this._saveButton = document.getElementById('save-plan') as HTMLButtonElement;
        this._state = new ToolState();
    }

    init() {

        //rivets.formatters.summary = function (value: string[]) {
        //    const length = value.length;
        //    return `You have entered ${length} ${length == 1 ? 'task' : 'tasks'}`;
        //}

        ko.applyBindings(this._state, this._plannerContainer);

        let that = this;
        this._createButton.addEventListener('click', function (e: Event) {
            that._state.isNew(false);

            console.log(that._state)
        });

        this._saveButton.addEventListener('click', function (e: Event) {
            ko.applyBindings(that._state, that._saveDialog);
            $(that._saveDialog).modal('show');
            that._state = new ToolState();
            ko.applyBindings(that._state, that._plannerContainer);
        });
    }
}


class ToolState {
    isNew = ko.observable(true);
    task = ko.observable('');
    tasks = ko.observableArray();
    canSave = ko.observable(false);

    isOnline() {
        return navigator.onLine;
    }

    addTask(e: Event, item: any): void {
        let state = item.state();
        state.tasks().push(state.task());
        state.task('');

        const canSave = state.tasks().length > 0
        state.canSave(canSave);
    }
    
}