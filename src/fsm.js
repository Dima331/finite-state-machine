class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.status = this.config.initial;
        this.undoStatus = [];
        this.redoStatus = [];
        this.counter = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.status;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.config.states[state]) {
            throw new Error('changeState error');
        } else {
            if (!this.undoStatus.length) {
                this.undoStatus.push(this.status)
            }
            this.status = state;
            this.undoStatus.push(this.status)
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this.config.states[this.status].transitions[event]) {
            throw new Error('trigger error');
        } else {
            if (!this.undoStatus.length) {
                this.undoStatus.push(this.status)
                this.redoStatus.push(this.status)
            }
            this.status = this.config.states[this.status].transitions[event]
            this.undoStatus.push(this.status)
            this.redoStatus.push(this.status)
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        return this.status = this.config.initial
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let allStates = Object.keys(this.config.states)
        let tmpArray = []

        if (event === undefined) {
            for (let i = 0; i < allStates.length; i++) {
                tmpArray.push(allStates[i]);
            }
        }

        for (let key of allStates) {
            if (this.config.states[key].transitions[event]) {
                tmpArray.push(key);
            }
        }
        return tmpArray
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        this.undoStatus.pop()
        this.counter++;
        this.status = this.undoStatus[this.undoStatus.length - 1]
        if (this.status == this.config.initial) {
            return true
        }
        if (!this.undoStatus.length) {
            return false
        }
        return this.status
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.counter == 0) {
            return false
        }
        var tmpLenght = this.undoStatus.length + this.counter
        this.undoStatus = []
        for (let i = 0; i < this.redoStatus.length; i++) {
            if (tmpLenght >= i) {
                this.undoStatus.push(this.redoStatus[i])
            }

        }
        this.status = this.undoStatus[this.undoStatus.length - 1]
        this.counter = 0;
        if (!this.redoStatus.length) {
            return false
        }
        if (this.status == this.config.initial) {
            return true
        }
        return true
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.undoStatus = [];
        this.redoStatus = [];
        this.counter = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/