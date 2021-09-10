import LightningDatatable from 'lightning/datatable';
import DatatablePicklist from './picklist-template.html';

export default class customDataTable extends LightningDatatable {
    static customTypes = {
        picklist: {
            template: DatatablePicklist,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context'],
        },

    };

}