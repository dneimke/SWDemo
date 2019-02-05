let rivets = require('rivets');
// let tinybind = require('tinybind');
// import tinybind from 'tinybind';

export class PlannerTool {

    private _plannerContainer: HTMLElement;
    private _createButton: HTMLButtonElement;
    private _saveButton: HTMLButtonElement;
    private _saveDialog: HTMLElement;
    private _state: ToolState;

    constructor() {
        this._state = new ToolState();

        this._plannerContainer = document.getElementById('planner-tool');
        this._saveDialog = document.getElementById('save-dialog');
        this._createButton = document.getElementById('create-plan') as HTMLButtonElement;
        this._saveButton = document.getElementById('save-plan') as HTMLButtonElement;
    }

    init() {

        rivets.formatters.summary = function (value: string[]) {
            const length = value.length;
            return `You have entered ${length} ${length == 1 ? 'task' : 'tasks'}`;
        }

        let view = rivets.bind(this._plannerContainer, { state: this._state });

        let that = this;
        this._createButton.addEventListener('click', function (e: Event) {
            that._state.new = false;
        });

        this._saveButton.addEventListener('click', function (e: Event) {

            const items = [...that._state.tasks];
            console.info(items);
            
            let dialogView = rivets.bind(that._saveDialog, { items });
            $(that._saveDialog).modal('show');
            
            that._state = new ToolState();
            view = rivets.bind(that._plannerContainer, { state: that._state });
        });
    }
}


class ToolState {
    new = true;
    task: string;
    tasks: string[] = [];
    canSave = false;

    isOnline() {
        return navigator.onLine;
    }

    addTask(e: Event, item: any): void {
        let state = item.state as ToolState;
        state.tasks.push(state.task);
        state.task = '';
        state.canSave = state.tasks.length > 0;
    }
    
}