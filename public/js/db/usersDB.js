class UsersDB{
    // Returns User object from users/{userId}. 
    static async getUser(userId) {
        let doc = await db.collection('users').doc(userId).get()

        let user = new User()

        user.docToUser(doc)

        return user
    }

    // Returns array of User objects from users. 
    static async getUsers() {
        let users = new Array()

        let result = await db.collection('users').get()

        result.forEach(doc => {
            let user = new User()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Returns array of User objects from users. 
    static async getActiveUsers() {
        let users = new Array()

        let result = await db.collection('users')
            .where('active' ,'==', true)
            // .where('role', '==', 'Carer')
            .get()

        result.forEach(doc => {
            let user = new User()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    static async getActiveCarers(){
        let users = new Array()

        let result = await db.collection('users')
            .where('active' ,'==', true)
            .where('role', '==', 'Carer')
            .get()

        result.forEach(doc => {
            let user = new User()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    static async getAdmins(){
        let users = new Array()

        let result = await db.collection('users')
            .where('active' ,'==', true)
            .where('role', '==', 'Admin')
            .get()

        result.forEach(doc => {
            let user = new User()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Returns array of User objects from all docs in users.   
    static async getDeactiveUsers() {
        let users = new Array()

        let result = await db.collection('users').where('active' ,'==', false).get()

        result.forEach(doc => {
            let user = new User()   
            user.docToUser(doc)
            users.push(user)
        })

        return users
    }

    // Adds a new doc to users. 
    static async addUser(id, role, name, address1, address2, town, county, eircode, active) {
        let user = new User(id, role, name, address1, address2, town, county, eircode, active)
        await db.collection("users").add(user.toFirestore())
    }

    // Deletes doc at users/{userId}.
    static async deleteUser(userId) {
        db.collection('users').doc(userId).delete()
    }

    // Sets users/{userId}/active field to false. 
    static async deactivateUser (userId) {
        await db.collection('users').doc(userId).update({
            "active": false
        })
    }

    // Sets users/{userId}/active field to true. 
    static async activateUser (userId) {
        await db.collection('users').doc(userId).update({
            "active": true
        })
    }
}
