import SalesforceForm from '~/controllers/salesforce-form';
import FormInput from '~/components/form-input/form-input';
import ManagedComponent from '~/helpers/controller/managed-component';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './student-form.html';

export default class StudentForm extends SalesforceForm {

    init(postUrl) {
        super.init();
        this.template = template;
        this.view = {
            classes: ['labeled-inputs', 'row', 'top-of-form']
        };
        this.model = {
            postUrl
        };
        const validationMessage = (name) => {
            const field = this.el && this.el.querySelector(`[name="${name}"]`);

            if (this.hasBeenSubmitted && field) {
                return field.validationMessage;
            }
            return '';
        };
        const inputs = {
            firstName: new FormInput({
                name: 'first_name',
                type: 'text',
                label: 'First name',
                required: true,
                validationMessage
            }),
            lastName: new FormInput({
                name: 'last_name',
                type: 'text',
                label: 'Last name',
                required: true,
                validationMessage
            }),
            email: new FormInput({
                name: 'email',
                type: 'email',
                label: 'Email address',
                required: true,
                validationMessage
            }),
            school: new FormInput({
                name: 'school',
                type: 'text',
                label: 'School name',
                required: true,
                validationMessage
            })
        };

        this.components = Object.keys(inputs).map((k) =>
            new ManagedComponent(inputs[k], k, this)
        );
    }

    onLoaded() {
        for (const c of this.components) {
            c.attach();
        }
        this.setCheckedness(true);
    }

    onUpdate() {
        for (const c of this.components) {
            c.update();
        }
    }

    setCheckedness(whether) {
        this.model.isChecked = whether;
        this.update();
    }

    @on('change [name="email_updates"]')
    toggleChecked(e) {
        this.setCheckedness(e.target.checked);
    }

}