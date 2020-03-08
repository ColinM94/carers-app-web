// Manages modules loading and unloading. 
class Module{
    // Loads new module. 
    static async load(moduleName, arg){
        const moduleRefs = {
            "Users": Users,
            "Clients" : Clients,
            "Admins" : Admins,
            "ClientProfile" : ClientProfile,
            "ClientsDeactive" : ClientsDeactive,
            "UsersDeactive" : UsersDeactive,
            "UserProfile" : UserProfile,
            "VisitDetails" : VisitDetails,
            "Meds" : Meds
        }

        var module = moduleRefs[moduleName]

        // Load module html.
        if(module.overlay == true){
            $("#module").hide()
            $("#module-overlay").show()
            
            $("#module-overlay").load("modules/" + moduleName)  
        }else{
            $("#module").show()
            $("#module-overlay").hide()

            // Loads {module}.html into #module.     
            $("#module").load("modules/" + moduleName)
        }

        startLoad()

        // Load module js. 
        module.load(arg).then(()=>{
            this.listeners()
            endLoad()
        })
    }

    static closeOverlay(){
        $("#module").show()
        $("#module-overlay").hide()
    }

    static listeners(){
        $("#btn-close-module").click(function() {
            Module.closeOverlay()
        })
    }
}