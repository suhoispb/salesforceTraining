import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/dynamicRowsController.getAccounts';

export default class Sample extends LightningElement {

    records;
    selectedValue = 'All';

    get options() {
        return [
            { label: 'None', value: '--None--' },
            { label: 'Hot', value: 'Hot' },
            { label: 'Warm', value: 'Warm' },
            { label: 'Cold', value: 'Cold' }
        ];
    }

    handleChange( event ) {

        this.selectedValue = event.detail.value;
        if ( this.selectedValue === 'All' )
            this.records = this.initialRecords;
        else
            this.records = [];

    }

    @wire( getAccounts )  
    wiredAccount( { error, data } ) {
        if (data) {
            this.records = data;
            this.initialRecords = data;
            this.error = undefined;
        } else if ( error ) {
            this.error = error;
            this.initialRecords = undefined;
            this.records = undefined;
        }

    }  
}