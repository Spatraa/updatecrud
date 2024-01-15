document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const userDataDiv = document.getElementById('userData');
    let editingIndex = -1; // To keep track of the index being edited
  
    // Load data from the backend API on page load
    fetchDataFromAPI();
  
    // Add event listener for form submission
    userForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
  
        const userDetails = {
            name: name,
            email: email,
            phone: phone
        };
  
        if (editingIndex > -1) {
            // If editingIndex is set, update the existing user details
            const userId = getUsersArray()[editingIndex]._id;
            axios.put(`https://crudcrud.com/api/16315bd528df47dca6a09d63ed7ff762/appointData/${userId}`, userDetails)
                .then(() => {
                    fetchDataFromAPI(); // Refresh data from the backend API after successful update
                })
                .catch((err) => {
                    console.log(err);
                });
  
            // Update the local storage data
            const usersArray = getUsersArray();
            usersArray[editingIndex] = userDetails;
            localStorage.setItem('users', JSON.stringify(usersArray));
  
            // Reset editingIndex
            editingIndex = -1;
        } else {
            // If editingIndex is not set, add a new user
            axios.post('https://crudcrud.com/api/16315bd528df47dca6a09d63ed7ff762/appointData', userDetails)
                .then(() => {
                    fetchDataFromAPI(); // Refresh data from the backend API after successful submission
                })
                .catch((err) => {
                    console.log(err);
                });
  
            // Update the local storage data
            const usersArray = getUsersArray();
            usersArray.push(userDetails);
            localStorage.setItem('users', JSON.stringify(usersArray));
        }
  
        // Render users on the website
        renderUsers();
        userForm.reset();
    });
  
    // Add event listener for page refresh
    window.addEventListener('beforeunload', function() {
        localStorage.removeItem('users');
    });
  
    function fetchDataFromAPI() {
        axios.get('https://crudcrud.com/api/16315bd528df47dca6a09d63ed7ff762/appointData')
            .then((response) => {
                const apiData = response.data;
                localStorage.setItem('users', JSON.stringify(apiData));
                renderUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    }
  
    function renderUsers() {
        userDataDiv.innerHTML = '';
  
        const usersArray = getUsersArray();
        usersArray.forEach((user, index) => {
            const userItem = document.createElement('ul');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
  
            deleteButton.addEventListener('click', function() {
                deleteUser(index, user._id);
            });
  
            editButton.addEventListener('click', function() {
                // Set editingIndex and populate the form with user details
                editingIndex = index;
                const { name, email, phone } = usersArray[index];
                document.getElementById('name').value = name;
                document.getElementById('email').value = email;
                document.getElementById('phone').value = phone;
            });
  
            userItem.innerHTML = `<li>Name: ${user.name} | Email: ${user.email} | Phone: ${user.phone}</li>`;
            userItem.appendChild(deleteButton);
            userItem.appendChild(editButton);
            userDataDiv.appendChild(userItem);
        });
    }
  
    function deleteUser(index, userId) {
        axios.delete(`https://crudcrud.com/api/16315bd528df47dca6a09d63ed7ff762/appointData/${userId}`)
            .then(() => {
                // Remove the user from local storage
                removeUserFromLocalStorage(index);
                // Render users on the website
                renderUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    }
  
    function removeUserFromLocalStorage(index) {
        const usersArray = getUsersArray();
        // Remove the user at the specified index
        usersArray.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(usersArray));
    }
  
    function getUsersArray() {
        const storedUsers = localStorage.getItem('users');
        return storedUsers ? JSON.parse(storedUsers) : [];
    }
});
