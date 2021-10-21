import { LightningElement, api } from 'lwc';

export default class DatatablePicklist extends LightningElement {
    @api label;
    @api placeholder;
    @api options;
    @api value;
    @api context;

    @api editing;
    checkEditing() {
        console.log('edit:', this.editing)
    }

    showPicklist=false;

    showPickistHandler() {
        this.showPicklist = true;
    }
    handleChange(event) {
        this.value = event.detail.value;        
        this.dispatchEvent(new CustomEvent('picklistchanged', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: { context: this.context, value: this.value }
            }
        }));
        this.showPicklist = false;
        console.log('picklistEvent:', event.detail)
        console.log('handleEditing:', this.editing)
    }

}