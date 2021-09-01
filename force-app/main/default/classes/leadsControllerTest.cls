@isTest
public with sharing class leadsControllerTest {
    @isTest
      static void getLeadsListTest() {
         Test.startTest();
         List<Lead> leadList = leadsController.getLeadList();
         Test.stopTest();
         System.assert(leadList.isEmpty());
      }
}
