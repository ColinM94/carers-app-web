// Populates clients datatable and sets up listeners. 
async function setupClients () {
    let clients = await getClients()

    $('#datatable').DataTable( {
        data: clients,
        "lengthChange": false,
        paging: false,
        oLanguage: {
            sLengthMenu: "_MENU_",
            sSearch: '', searchPlaceholder: "Search..." 
        },
        initComplete : function() {
            $("#datatable_filter").detach().appendTo('#datatableSearch');
        },
        columns: [
            { title: "ID", data: "id", visible: false},
            { title: "Name", data: "name" },
            { title: "DOB", data: "dob"},
            { title: "Mobile", data: "mobile"},
            { title: "Address 1", data: "address1"},
            { title: "Address 2",data: "address2"},
            { title: "Town",data: "town"},
            { title: "County", data: "county"},
            { title: "Eircode", data: "eircode"},
            { title: "Marital Status", data: "marital"},
            {mRender: function (data, type, row) {
                return `<a href="javascript:editClientForm('${row.id}')">Edit</a>`
            }},
            {mRender: function (data, type, row) {
                return `<a href="javascript:confirmDeactivate('${row.id}')">Deactivate</a>`
            }},
            {mRender: function (data, type, row) {
                return `<a href="javascript:viewClientProfile('${row.id}')">View Profile</a>`
            }},
        ]
    })

    listeners()
}

// Opens modal and inserts values into edit client form. 
function editClientForm(clientId) {
    $('#modalEditClient').modal('show')

    getClient(clientId).then(result => {
        $("#editClientId").val(clientId)
        $("#editClientName").val(result.name)
        $("#editClientDob").val(result.dob) 
        $("#editClientMobile").val(result.mobile) 
        $("#editClientAddress1").val(result.address1) 
        $("#editClientAddress2").val(result.address2) 
        $("#editClientTown").val(result.town) 
        $("#editClientCounty").val(result.county) 
        $("#editClientEircode").val(result.eircode) 
        $("#editClientMarital").val(result.marital) 
    })
}

// Displays selected client details. 
async function viewClientProfile(clientId){
    $('#clientsList').hide()
    $('#clientProfile').show() 

    let client = await getClient(clientId)
    let connections = await getConnections(clientId)

    $('#client-profile-id').text(` ${client.id}`)
    $('#clientProfileTitle').html(` ${client.name}'s Profile`)
    $('#clientProfileName').text(` ${client.name}`)
    $('#clientProfileMobile').text(` ${client.mobile}`)
    $('#clientProfileAddress').text(` ${client.address1}, ${client.address2}, ${client.town}, ${client.county}, ${client.eircode}`)
        
    if(connections != null){
        connections.forEach(userId => {
            getUser(userId).then(user => {
                $("#client-connections").append(`${user.role}: <a href="${user.id}">${user.name}</a> <a href="javascript:confirmDeleteConn('${client.id}','${user.id}')" style="color:red;">[X]</a>`)
            })
        })
    }
}

function refreshProfile(clientId){
    // Clears connections. 
    $("#client-connections").html("")

    $('#client-profile-id').text("")
    $('#clientProfileTitle').html("")
    $('#clientProfileName').text("")
    $('#clientProfileMobile').text("")
    $('#clientProfileAddress').text("")

    $('#select-user-list').empty()

    viewClientProfile(clientId)
}

// Prompts user to confirm client deletion. 
function confirmDeactivate(clientId){
    $('#modal-client-deactivate').modal('show')
    $('#idHolder').text(clientId)
}

// Prompts user to confirm connection deletion. 
function confirmDeleteConn(clientId, userId){
    $('#modal-client-delete-conn').modal('show')
    $('#client-conn-clientidholder').text(clientId)
    $('#client-conn-useridholder').text(userId)
}

// Resets and reloads datatable. 
async function refreshTable(){
    let clients = await getClients()
    let table = $('#datatable').DataTable()

    table.clear() 
    table.rows.add(clients)
    table.draw()
}

// Handlers.
async function addConnectionHandler(clientId, userId){
    await addConnection(userId, clientId)
    viewClientProfile(clientId)
}

async function deleteConnHandler(clientId, userId){
    $('#modal-client-delete-conn').modal('hide')
    await deleteConnection(clientId, userId)
    refreshProfile(clientId)
}

// Instantiates listeners. 
function listeners() {
    $("#formAddClient").submit(function(event) {
        event.preventDefault()

        let name = $("#addClientName").val()
        let dob = $("#addClientDob").val()
        let mobile = $("#addClientMobile").val()
        let address1 = $("#addClientAddress1").val()
        let address2 = $("#addClientAddress2").val()
        let town = $("#addClientTown").val()
        let county = $("#addClientCounty").val()
        let eircode = $("#addClientEircode").val()
        let marital = $("#addClientMarital").val()

        addClient(name, dob, mobile, address1, address2, town, county, eircode, marital, true)

        $('#addClientModal').modal('hide')
    })

    $("#formEditClient").submit(function(event) {
        event.preventDefault()

        let id = $("#editClientId").val()
        let name = $("#editClientName").val()
        let dob = $("#editClientDob").val()
        let mobile = $("#editClientMobile").val()
        let address1 = $("#editClientAddress1").val()
        let address2 = $("#editClientAddress2").val()
        let town = $("#editClientTown").val()
        let county = $("#editClientCounty").val()
        let eircode = $("#editClientEircode").val()
        let marital = $("#editClientMarital").val()

        updateClient(id, name, dob, mobile, address1, address2, town, county, eircode, marital, true)

        $('#modalEditClient').modal('hide')
    })

    $("#form-add-connection").submit(function(event) {
        event.preventDefault()

        let clientId = $('#client-profile-id').text().replace(/\s/g, '')
        let userId = $('#select-user-list').val()
        
        addConnectionHandler(clientId, userId)
    })

    $('#btn-add-connection').click(function(){
        $('#modal-add-connection').modal('show')

        // Clears list. 
        $('#select-user-list').empty()

        getUsers().then(users => {
            users.forEach(user => {
                $("#select-user-list").append(new Option(`${user.name} : ${user.id}`, user.id))
            })
        })

        $('#modal-add-connection').modal('hide')
    })

    $('#btn-client-deactivate').click(function(){
        var clientId = $('#idHolder').text()
        $('#modal-client-deactivate').modal('hide')
        deactivateClient(clientId)
        refreshTable()
    })

    $('#btn-client-delete-conn').click(function(){
        var clientId = $('#client-conn-clientidholder').text()
        var userId = $('#client-conn-useridholder').text()
        deleteConnHandler(clientId, userId)
    })

    $('#btnCloseProfile').click(function(){
        $('#clientsList').show()
        $('#clientProfile').hide()
    })
}



