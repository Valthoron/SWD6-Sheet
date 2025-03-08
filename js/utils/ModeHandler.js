export class ModeHandler {
    constructor() {
        this.currentMode = '';

        this.buttons = {
            'view': document.getElementById('nav-mode-view'),
            'create': document.getElementById('nav-mode-create'),
            'advance': document.getElementById('nav-mode-advance')
        };

        this.buttons['view'].addEventListener('click', () => this.switchMode('view'));
        this.buttons['create'].addEventListener('click', () => this.switchMode('create'));
        this.buttons['advance'].addEventListener('click', () => this.switchMode('advance'));
    }

    initialize() {
        this.switchMode('view');
        return this;
    }

    switchMode(mode) {
        if (this.currentMode === mode) return;

        this.buttons[this.currentMode]?.classList.remove('navbar__button--active');
        this.buttons[mode].classList.add('navbar__button--active');

        // Set mode
        this.currentMode = mode;
        document.body.setAttribute('mode', mode);
    }
}
