public with sharing class contactsContoller {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsList() {
    List<Contact> conList=new List<Contact>();
    conList=[ SELECT Id, Name FROM Contact LIMIT 10 ];
      return conList;
  }
  }



