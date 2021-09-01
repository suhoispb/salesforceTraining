public with sharing class leadsController {

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadList() {
      List<Lead> leadsList=new List<Lead>();
      leadsList=[ SELECT Name, Title, Phone, Id FROM Lead  LIMIT 10 ];
      return leadsList;
    }
  }
