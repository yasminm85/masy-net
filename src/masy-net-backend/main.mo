import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";

persistent actor {
    type PositionLevel = {
        #Entry;
        #Junior;
        #Senior;
        #Manager;
    };

    type Contract = {
        spec_position: Text;
        position: PositionLevel;
        startDate: Text;
        endDate: ?Text;
        responsibilities: ?Text;
        signedBy: ?Principal;
        signedAt: ?Text;
        contracthash: ?Text;
        signature: ?Text;
        isSigned: Bool;
    };

    type Employees = {
        EmployeeID: Nat;
        name: Text;
        email: Text;
        phone: Text;
        department: Text;
        currentpositionlevel: Text;
        currentposition: Text;
        positionHistory: [Contract];
    };

    func positionToLevel(pos: PositionLevel): Text {
        switch (pos){
            case (#Entry) {"Entry"};
            case (#Junior) {"Junior"};
            case (#Senior) {"Senior"};
            case (#Manager) {"Manager"};
        }
    };

    func ContractHash(contract: Contract): Text {
        let content = contract.spec_position #
                     positionToLevel(contract.position) #
                     contract.startDate #
                     (switch(contract.endDate) {case null ""; case (?date) date}) #
                     (switch(contract.responsibilities) {case null ""; case (?resp) resp});

        let hashValue = Text.hash(content);
        Nat32.toText(hashValue)
    };

    func Signature(contractHash: Text, signer: Principal, timestamp: Text): Text {
        let signatureContent = contractHash # Principal.toText(signer) # timestamp;
        let hashValue = Text.hash(signatureContent);
        Nat32.toText(hashValue)
    };

    stable var employeeStableV3: [(Nat, Employees)] = [];
    stable var employeeIdCountStableV3: Nat = 0;

    transient var employee = HashMap.HashMap<Nat, Employees>(10, Nat.equal, Hash.hash);
    var employeeIdCount: Nat = 0;

    public func addEmployees(name: Text, email: Text, phone: Text, department: Text, currentpositionlevel: PositionLevel, initialPosition: Text, startDate: Text, responsibilities: ?Text): async Nat {
        let id = employeeIdCount;
        employeeIdCount += 1;
        
        let contract: Contract = {
            spec_position = initialPosition;
            position = currentpositionlevel;
            startDate = startDate;
            endDate = null;
            responsibilities = responsibilities;
            signedBy = null;
            signedAt = null;
            contracthash = null;
            signature = null;
            isSigned = false;
        };
        
        let employees: Employees = {
            EmployeeID = id;
            name = name;
            email = email;
            phone = phone;
            department = department;
            currentpositionlevel = positionToLevel(currentpositionlevel);
            currentposition = initialPosition; 
            positionHistory = [contract];
        };
        
        employee.put(id, employees);
        
        return id;
    };

    func updateLastContractEndDate(history: [Contract], newStartDate: Text): [Contract] {
        let historyArray = Array.thaw<Contract>(history);
        let lastIndex = historyArray.size() - 1;
        
        if (lastIndex >= 0) {
            let lastContract = historyArray[lastIndex];
            let updatedContract: Contract = {
                lastContract with
                endDate = ?newStartDate;
            };
            historyArray[lastIndex] := updatedContract;
        };
        
        Array.freeze(historyArray)
    };

    public func addContract(employeeId: Nat, newContract: Contract): async Bool {
        switch (employee.get(employeeId)){
            case null {
                return false;
            };
            case (?emp) {
                let updatedHistory = updateLastContractEndDate(emp.positionHistory, newContract.startDate);
                let unsigned: Contract = {
                    newContract with
                    signedBy = null;
                    signedAt = null;
                    contracthash = null;
                    signature = null;
                    isSigned = false;
                };
                let fixHistory = Array.append(updatedHistory, [newContract]);
                let updateEmployee: Employees = {
                    emp with
                    positionHistory = fixHistory;
                    currentpositionlevel = positionToLevel(newContract.position); 
                    currentposition = newContract.spec_position;
                };
                employee.put(employeeId, updateEmployee);
                return true;
            };
        };
    };

    public func signContract(employeeId: Nat, contractIndex: Nat, signer: Principal): async Bool {
        switch (employee.get(employeeId)){
            case null {
                return false;
            };
            case (?emp) {
                let historyArray = Array.thaw<Contract>(emp.positionHistory);
                
                if (contractIndex >= historyArray.size()) {
                    return false;
                };
                
                let contractToSign = historyArray[contractIndex];
                
                let timestamp = Int.toText(Time.now());
                
                let hash = ContractHash(contractToSign);
                let signature = Signature(hash, signer, timestamp);
                
                let signedContract: Contract = {
                    contractToSign with
                    signedBy = ?signer;
                    signedAt = ?timestamp;
                    contracthash = ?hash;
                    signature = ?signature;
                    isSigned = true;
                };
                
                historyArray[contractIndex] := signedContract;
                
                let updatedEmployee: Employees = {
                    emp with
                    positionHistory = Array.freeze(historyArray);
                };
                
                employee.put(employeeId, updatedEmployee);
                return true;
            };
        };
    };

    public query func verifyContractSignature(employeeId: Nat, contractIndex: Nat): async ?{
        isValid: Bool;
        signedBy: ?Principal;
        signedAt: ?Text;
        contracthash: ?Text;
    } {
        switch (employee.get(employeeId)) {
            case null { return null; };
            case (?emp) {
                if (contractIndex >= emp.positionHistory.size()) {
                    return null;
                };
                
                let contract = emp.positionHistory[contractIndex];
                
                if (not contract.isSigned) {
                    return ?{
                        isValid = false;
                        signedBy = null;
                        signedAt = null;
                        contracthash = null;
                    };
                };
                
                let expectedHash = ContractHash(contract);
                let isHashValid = switch(contract.contracthash) {
                    case null false;
                    case (?hash) hash == expectedHash;
                };
                
                let isSignatureValid = switch(contract.signature, contract.signedBy, contract.signedAt) {
                    case (?sig, ?signer, ?timestamp) {
                        let expectedSig = Signature(expectedHash, signer, timestamp);
                        sig == expectedSig;
                    };
                    case _ false;
                };
                
                return ?{
                    isValid = isHashValid and isSignatureValid;
                    signedBy = contract.signedBy;
                    signedAt = contract.signedAt;
                    contracthash = contract.contracthash;
                };
            };
        };
    };

    public query func getPositionHistory(employeeId: Nat): async ?[Contract]{
        switch (employee.get(employeeId)) {
            case null {
                return null;
            };
            case (?emp) {
                return ?emp.positionHistory;
            };
        };
    };

    system func preupgrade() {
        employeeStableV3 := Iter.toArray(employee.entries());
        employeeIdCountStableV3 := employeeIdCount;
    };

    system func postupgrade() {
        
        employee := HashMap.fromIter<Nat, Employees>(
            employeeStableV3.vals(),
            employeeStableV3.size(),
            Nat.equal,
            Hash.hash
        );
        
        employeeIdCount := employeeIdCountStableV3;
        
    };

    public func initializeFromStable(): async Nat {
        if (employeeStableV3.size() > 0 and employee.size() == 0) {
            employee := HashMap.fromIter<Nat, Employees>(
                employeeStableV3.vals(),
                employeeStableV3.size(),
                Nat.equal,
                Hash.hash
            );
            employeeIdCount := employeeIdCountStableV3;
        };
        return employee.size();
    };

    public query func getEmployeeDetail(employeeId: Nat): async ?Employees {
        employee.get(employeeId)
    };

    public query func listEmployees(): async [Employees] {
        Iter.toArray(employee.vals())
    };

    public func fixIdCounter(): async Nat {
        var maxId: Nat = 0;
        for ((id, _) in employee.entries()) {
            if (id >= maxId) {
                maxId := id + 1;
            };
        };
        employeeIdCount := maxId;
        employeeIdCountStableV3 := maxId;
        return maxId;
    };
};