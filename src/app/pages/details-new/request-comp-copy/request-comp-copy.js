import {Controller} from 'superb.js';
import shell from '~/components/shell/shell';
import {on} from '~/helpers/controller/decorators';
import RequestForm from './request-form/request-form';
import {description as template} from './request-comp-copy.html';

export default class RequestCompCopy extends Controller {

    init(getProps, handlers) {
        this.template = template;
        this.getProps = getProps;
        this.handlers = handlers;
        this.view = {
            classes: ['resource-box']
        };

        this.dialogProps = {
            title: 'Request your complimentary iBooks download',
            content: this.createContent()
        };
    }

    createContent() {
        const formHandlers = {
            done: () => this.closeDialog(),
            showConfirmation: () => this.setAltTitle()
        };

        return new RequestForm(this.getProps, formHandlers);
    }

    closeDialog() {
        shell.hideDialog();
    }

    setAltTitle() {
        this.dialogProps.htmlTitle = '<span class="fa fa-check"></span>';
        this.dialogProps.customClass = 'request-comp-copy-dialog';
        shell.dialog.update();
    }

    @on('click')
    showModal() {
        shell.showDialog(() => this.dialogProps);
    }

}