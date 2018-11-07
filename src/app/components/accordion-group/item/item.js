import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './item.html';
import componentType from '~/helpers/controller/init-mixin';

const spec = {
    template,
    view: {
        classes: ['accordion-item']
    },
    regions: {
        contentPane: '.content-pane'
    },
    model() {
        this.props = this.getProps();
        const isOpen = this.props.selectedLabel === this.props.label;

        return {
            label: isOpen ? this.props.openLabel : this.props.label,
            chevronDirection: isOpen ? 'down' : 'right',
            hiddenAttribute: isOpen ? null : ''
        };
    }
};

export default class AccordionItem extends componentType(spec) {

    onLoaded() {
        if (this.props.contentComponent) {
            this.regions.contentPane.attach(this.props.contentComponent);
        }
    }

    @on('click .control-bar')
    selectThisTab(event) {
        if (event.delegateTarget.parentNode === this.el) {
            const isOpen = this.props.selectedLabel === this.props.label;

            this.handlers.setSelected(isOpen ? null : this.props.label);
            if (!isOpen) {
                $.scrollTo(this.el);
            }
        }
    }

}
