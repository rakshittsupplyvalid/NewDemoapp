// types.ts
export type RootStackParamList = {
    LoginApp: undefined;
    Drawernavigator: undefined;
    SelectFederation: undefined;  // Add this type for SelectFederation screen
    Home: undefined;  // No params for Home screen
    Login: undefined;  // No params for Login screen
    Profile: undefined;  // No params for Profile screen
    List: undefined;  // No params for List screen
    WarehouseDrawernavigator: undefined;
    AssyingDrawernavigator: undefined;
    DispatchDrawernavigator: undefined;
    RecieveDrawernavigator: undefined;
    HealthReportselect: undefined;
    ReimbursementForm: undefined;
    ReimbursementList: { ApprovalStatus: string; BillPaymentStatus?: string };
    
    DispatchRecieve :  { quantitymt: string };
    Dashboard : undefined;

    "Generate Health Report": undefined;
    "Health Report List": undefined;
    "Dispatch Report List": undefined;
    "Dispatch Truck List": undefined;
    "Receive Truck List": undefined;
    HealthReport :  { 
      truckNumber: string;
  grossWeight: string;
  netWeight: string;
  tareWeight: string;
  bagCount: string;
  size: string;
  selectedDate: Date;
     };

  };
  