import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './accessibility-statement.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    css: '/app/pages/accessibility-statement/accessibility-statement.css',
    templateHelpers: {strips}
})
export default class Accessibility extends BaseView {}
