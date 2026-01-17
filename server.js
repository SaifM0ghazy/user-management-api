import express from "express"

const PORT = 3000;
const app = express();
app.use(express.json());

// this dataBase in memory
const fakeDataBase = [
    { id: 1, name: "Saif Moghazy", role: "admin", active: true, status: "online", age: 30, country: "Egypt" },
    { id: 2, name: "Sara Ahmed", role: "user", active: true, status: "offline", age: 25, country: "Egypt" },
    { id: 3, name: "Omar Ali", role: "user", active: false, status: "offline", age: 28, country: "USA" },
    { id: 4, name: "Mona Hassan", role: "admin", active: true, status: "online", age: 25, country: "Egypt" },
    { id: 5, name: "Khaled Yasser", role: "user", active: false, status: "online", age: 22, country: "KSA" },
    { id: 6, name: "Nour Salah", role: "user", active: true, status: "online", age: 30, country: "USA" },
    { id: 7, name: "Tamer Fathy", role: "admin", active: false, status: "offline", age: 35, country: "KSA" },
    { id: 8, name: "Layla Mohamed", role: "user", active: true, status: "offline", age: 27, country: "Egypt" },
    { id: 9, name: "Ahmed Hossam", role: "admin", active: true, status: "online", age: 40, country: "USA" },
    { id: 10, name: "Rana Samir", role: "user", active: false, status: "offline", age: 23, country: "KSA" }
];

// Read all users data 
// Read data based on filters (Query Parameters)
// In real life we ​​use SQL or MongoDB, etc.

// **** ( Read concepts ) 

app.get("/users", (req, res) => {
    try {
        if (fakeDataBase.length === 0) {
            return res.status(200).json({
                status: true,
                message: "No users found",
                data: []
            });
        }

        let filteredUsers = [...fakeDataBase];

        for (let key in req.query) {
            let queryValue = req.query[key];


            filteredUsers = filteredUsers.filter(user => {
                if (typeof user[key] === "boolean") {
                    return user[key] === (queryValue === "true");
                }

                if (typeof user[key] === "number") {
                    return user[key] === Number(queryValue);
                }

                return String(user[key]) === queryValue;
            });
        }

        if (filteredUsers.length === 0) {
            return res.status(200).json({
                status: true,
                message: "No users found with the given filters",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Users fetched successfully",
            data: filteredUsers
        });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            status: false,
            message: "There is an error on the server side."
        });
    }
});

// Bring one special item using ( Path Parameters )

app.get("/users/:id", (req, res) => {
    try {
        const pathUserRequestid = parseInt(req.params.id);

        // The Client can enter a non-numeric value!

        if (isNaN(pathUserRequestid)) {
            return res.status(400).json({
                status: false,
                message: ` is not a valid user ID '${req.params.id}'`
            });
        }

        const userData = fakeDataBase.find(user => user.id === pathUserRequestid);

        // If there isn't a user who actually has an ID like the one sent

        if (!userData) {
            return res.send(
                {
                    status: false,
                    message: `User with id '${pathUserRequestid}' not found`,
                }
            )
        }

        return res.status(200).json({
            status: true,
            message: "User fetched successfully",
            data: userData
        });

    } catch (e) {
        console.log(e.message);

        return res.status(500).json(
            {
                status: false,
                "message": "There is an error on the server side."
            }
        );

    }

})

// ============== Thus we learned the concept of reading And filters ==============

// **** ( Create concepts ) 

app.post("/users", (req, res) => {
    try {

        const { name, age, country } = req.body;
        const supportedCountries = ["egypt", "usa", "ksa"];

        if (!name || age === undefined || !country) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        if (typeof country !== "string") {
            return res.status(400).json({
                status: false,
                message: "Country must be a string"
            });
        }

        const normalizedCountry = country.trim().toLowerCase();

        if (!supportedCountries.includes(normalizedCountry)) {
            return res.status(400).json({
                status: false,
                message: "Your country is not supported at the moment"
            });
        }

        if (typeof age !== "number" || age < 12 || age > 100) {
            return res.status(400).json({
                status: false,
                message: "Age must be a number between 12 and 100"
            });
        }

        const dataId = fakeDataBase.length === 0
            ? 1
            : fakeDataBase[fakeDataBase.length - 1].id + 1;

        const userData = {
            id: dataId,
            name,
            role: "user",
            active: false,
            status: "offline",
            age,
            country: normalizedCountry
        };

        fakeDataBase.push(userData);

        return res.status(201).json({
            status: true,
            message: "User created successfully",
            data: userData
        });

    } catch (e) {
        console.log(e.message);

        return res.status(500).json(
            {
                status: false,
                "message": "There is an error on the server side."
            }
        );
    }
});

// ==============  Here we learned how to create and validate expected cases. ==============

// **** ( Delete concepts ) 

app.delete("/users/:id", (req, res) => {
    try {
        const idPath = parseInt(req.params.id);

        if (isNaN(idPath)) {
            return res.status(400).json({
                status: false,
                message: "ID must be a number"
            });
        }

        const userIndex = fakeDataBase.findIndex(user => user.id === idPath);

        if (userIndex === -1) {
            return res.status(404).json({
                status: false,
                message: `User with ID ${idPath} not found, cannot delete`
            });
        }

        const deletedUser = fakeDataBase.splice(userIndex, 1)[0];

        return res.status(200).json({
            status: true,
            message: `User with ID ${idPath} deleted successfully`,
            data: deletedUser
        });
    } catch (e) {
        console.log(e.message);

        return res.status(500).json(
            {
                status: false,
                "message": "There is an error on the server side."
            }
        );
    }
});

// ==============  Here we learned how to Delete ==============

// **** ( Update concepts )

// PUT Complete update (best practices)

app.put("/users/:id", (req, res) => {
    try {
        const idPath = parseInt(req.params.id);

        if (isNaN(idPath)) {
            return res.status(400).json({
                status: false,
                message: "ID must be a number"
            });
        }

        const userIndex = fakeDataBase.findIndex(user => user.id === idPath);

        if (userIndex === -1) {
            return res.status(404).json({
                status: false,
                message: `User with ID ${idPath} not found`
            });
        }

        const { name, age, country, role, active, status } = req.body;

        if (!name || age === undefined || !country || !role || active === undefined || !status) {
            return res.status(400).json({
                status: false,
                message: "All fields are required for PUT"
            });
        }

        fakeDataBase[userIndex] = {
            id: idPath,
            name,
            age,
            country,
            role,
            active,
            status
        };

        return res.status(200).json({
            status: true,
            message: "User updated successfully",
            data: fakeDataBase[userIndex]
        });
    } catch (e) {
        console.log(e.message);

        return res.status(500).json(
            {
                status: false,
                "message": "There is an error on the server side."
            }
        );
    }
});

//Partial update ( best practices )

app.patch("/users/:id", (req, res) => {
    try {
        const idPath = parseInt(req.params.id);

        if (isNaN(idPath)) {
            return res.status(400).json({
                status: false,
                message: "ID must be a number"
            });
        }

        const userIndex = fakeDataBase.findIndex(user => user.id === idPath);

        if (userIndex === -1) {
            return res.status(404).json({
                status: false,
                message: `User with ID ${idPath} not found`
            });
        }

        const user = fakeDataBase[userIndex];


        const updatedUser = {
            ...user,
            ...req.body
        };

        fakeDataBase[userIndex] = updatedUser;

        return res.status(200).json({
            status: true,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (e) {
        console.log(e.message);

        return res.status(500).json(
            {
                status: false,
                "message": "There is an error on the server side."
            }
        );
    }
});


// You can make the search case-insensitive and implement some checks to make the API easier to use, and search and edit the status code. Practice now!

//Now, anyone can delete, add, and edit. We mostly want to grant permissions, so look up the meaning of "authentication" so we can apply this concept in a later lesson.

// Saif Moghazy
app.listen(PORT, () => console.log(`Server run http://localhost:${PORT || 2000}`))