
$(document).ready(function () {
    // Vehicles data
    const vehicles = [
        {
            id: 1,
            model: 'Fiat Cronos Drive 1.3',
            pricePerDay: 16000,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 2,
            model: 'Fiat Cronos Precision 1.8',
            pricePerDay: 17500,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 3,
            model: 'Fiat Cronos Drive Pack Conectividad',
            pricePerDay: 17000,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 4,
            model: 'Fiat Cronos Precision AT6',
            pricePerDay: 18500,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 5,
            model: 'Fiat Cronos S-Design',
            pricePerDay: 19000,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 6,
            model: 'Fiat Cronos Like 1.3',
            pricePerDay: 16500,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 7,
            model: 'Fiat Cronos Drive GSR',
            pricePerDay: 18000,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 8,
            model: 'Fiat Cronos Precision CVT',
            pricePerDay: 20000,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 9,
            model: 'Fiat Cronos HGT',
            pricePerDay: 21000,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        },
        {
            id: 10,
            model: 'Fiat Cronos Precision Full',
            pricePerDay: 19500,
            image: 'https://cdn.pixabay.com/photo/2023/05/23/13/01/fiat-8011196_1280.jpg'
        }
    ];

    // Navigation
    function showSection(sectionId) {
        $('#home-section, #fleet-section, #login-section, #register-section').addClass('hide');
        $(sectionId).removeClass('hide');
    }


    $('#home-link').click(function () {
        showSection('#home-section');
    });

    $('#fleet-link').click(function () {
        showSection('#fleet-section');
        populateVehicles();
    });

    $('#login-link').click(function () {
        showSection('#login-section');
    });

    $('#register-link').click(function () {
        showSection('#register-section');
    });

    $('#view-fleet-btn').click(function () {
        showSection('#fleet-section');
        populateVehicles();
    });

    // Populate vehicles
    function populateVehicles() {
        const container = $('#vehicle-container');
        container.empty();

        $.ajax({
            type: "GET",
            url: "https://localhost:44343/api/vehiculos",
            dataType: "json",
            success: function (vehiculos) {
                if (Array.isArray(vehiculos)) {
                    vehiculos.forEach(vehicle => {
                        const card = `
            <div class="col-md-4 col-sm-6 mb-4">
              <div class="card vehicle-card h-100">
                <div class="card-body">
                  <h5 class="card-title">${vehicle.marca} ${vehicle.modelo}</h5>
                  <p class="card-text">Placa: ${vehicle.placa}</p>
                  <p class="card-text">Estado: ${vehicle.estado}</p>
                  <button class="btn neon-btn-black rent-btn" data-vehicle-id="${vehicle.vehiculoId}">Alquilar</button>
                </div>
              </div>
            </div>`;
                        container.append(card);
                    });

                    $('.rent-btn').click(function () {
                        const vehicleId = $(this).data('vehicle-id');
                        
                            openReservationModal(vehicleId);
                        
                    });
                } else {
                    console.error("Respuesta inesperada de la API", vehiculos);
                }
            },
            error: function (xhr) {
                console.error("Error al obtener los vehículos:", xhr);
            }
        });
    }


    // User authentication
    let currentUser = null;

    // Check if user is already logged in
    function checkLoggedInUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
            updateNavForLoggedInUser();
        }
    }

    function updateNavForLoggedInUser() {
        if (currentUser) {
            $('#login-link, #register-link').parent().addClass('d-none');
            $('#user-info, #logout-item').removeClass('d-none');
            $('#user-name').text(currentUser.firstName);
        } else {
            $('#login-link, #register-link').parent().removeClass('d-none');
            $('#user-info, #logout-item').addClass('d-none');
        }
    }

    // Register form submission
    $('#register-form').submit(function (e) {
        e.preventDefault();

        const firstName = $('#register-firstname').val();
        const lastName = $('#register-lastname').val();
        const email = $('#register-email').val();
        const password = $('#register-password').val();

        // Save user to localStorage
        const newUser = {
            firstName,
            lastName,
            email,
            password
        };

        // Get existing users or create new array
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Set as current user
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update UI
        updateNavForLoggedInUser();

        // Redirect to fleet
        showSection('#fleet-section');
        populateVehicles();

        // Reset form
        $('#register-form')[0].reset();
    });

    // Login form submission
    $('#login-form').submit(function (e) {
        e.preventDefault();

        const email = $('#login-email').val();
        const password = $('#login-password').val();

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Find user
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Set as current user
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Update UI
            updateNavForLoggedInUser();

            // Redirect to fleet
            showSection('#fleet-section');
            populateVehicles();

            // Reset form
            $('#login-form')[0].reset();
        } else {
            alert('Invalid email or password');
        }
    });

    // Logout
    $('#logout-link').click(function () {
        // Clear current user
        currentUser = null;
        localStorage.removeItem('currentUser');

        // Update UI
        updateNavForLoggedInUser();

        // Redirect to home
        showSection('#home-section');
    });

    // Reservation modal
    let selectedVehicle = null;

    function openReservationModal(vehicleId) {
        // Check if user is logged in
        if (!currentUser) {
            alert('Please login to make a reservation');
            showSection('#login-section');
            return;
        }

        // Find vehicle
        selectedVehicle = vehicles.find(v => v.id === vehicleId);

        // Set user details
        $('#fullname').val(`${currentUser.firstName} ${currentUser.lastName}`);

        // Reset other fields
        $('#dni, #address, #start-date, #rental-days').val('');
        $('#total-cost').val('');

        // Show modal
        const reservationModal = new bootstrap.Modal(document.getElementById('reservationModal'));
        reservationModal.show();

        // Reset modal state
        $('#reservation-form').show();
        $('#reservation-loading, #reservation-success').addClass('hide');
        $('#modal-footer-buttons').show();
    }

    // Calculate total cost
    $('#rental-days, #start-date').on('change input', function () {
        if (selectedVehicle && $('#rental-days').val()) {
            const days = parseInt($('#rental-days').val());
            const totalCost = days * selectedVehicle.pricePerDay;
            $('#total-cost').val(totalCost.toLocaleString('es-AR'));
        }
    });

    // Confirm reservation
    $('#confirm-reservation').click(function () {
        // Validate form
        if (!$('#reservation-form')[0].checkValidity()) {
            $('#reservation-form')[0].reportValidity();
            return;
        }

        // Get form data
        const reservationData = {
            vehicleId: selectedVehicle.id,
            vehicleModel: selectedVehicle.model,
            fullName: $('#fullname').val(),
            dni: $('#dni').val(),
            address: $('#address').val(),
            startDate: $('#start-date').val(),
            days: parseInt($('#rental-days').val()),
            totalCost: $('#total-cost').val().replace(/,/g, ''), // Remove commas for calculation
            paymentMethod: $('input[name="payment-method"]:checked').val(),
            userId: currentUser.email,
            timestamp: new Date().toISOString()
        };

        // Show loading
        $('#reservation-form').hide();
        $('#modal-footer-buttons').hide();
        $('#reservation-loading').removeClass('hide');

        // Simulate processing time
        setTimeout(function () {
            // Hide loading
            $('#reservation-loading').addClass('hide');

            // Show success
            $('#reservation-success').removeClass('hide');

            // Set summary details
            $('#summary-vehicle').text(selectedVehicle.model);
            $('#summary-date').text(new Date(reservationData.startDate).toLocaleDateString());
            $('#summary-days').text(reservationData.days);
            $('#summary-cost').text(reservationData.totalCost);
            $('#summary-payment').text(reservationData.paymentMethod);

            // Save reservation to localStorage
            let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
            reservations.push(reservationData);
            localStorage.setItem('reservations', JSON.stringify(reservations));
        }, 1500);
    });

    // Make another reservation
    $('#make-another-reservation').click(function () {
        // Hide modal
        const reservationModal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
        reservationModal.hide();

        // Redirect to fleet
        showSection('#fleet-section');
        populateVehicles();
    });

    // Initialize
    checkLoggedInUser();
    showSection('#home-section');
});


document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector("#register-section .toggle-password");
    const passwordInput = document.getElementById("register-password");
    const toggleIcon = document.getElementById("register-toggle-icon");

    toggleBtn.addEventListener("click", function () {
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";
        toggleIcon.className = isHidden ? "bi bi-eye-slash-fill" : "bi bi-eye-fill";
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');
    const toggleIcon = document.getElementById('toggle-icon');

    togglePassword.addEventListener('click', function () {
        // Cambiar el tipo de input
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Cambiar el icono
        if (type === 'text') {
            toggleIcon.classList.remove('bi-eye-fill');
            toggleIcon.classList.add('bi-eye-slash-fill');
        } else {
            toggleIcon.classList.remove('bi-eye-slash-fill');
            toggleIcon.classList.add('bi-eye-fill');
        }
    });
});

// Obtener ambos elementos
const fleetLink = document.getElementById('fleet-link');
const fleetButton = document.getElementById('fleet-button');

// Asignar el mismo comportamiento al botón que al enlace del nav
fleetButton.addEventListener('click', function (e) {
    e.preventDefault(); // Prevenir comportamiento por defecto
    fleetLink.click(); // Disparar el click en el enlace del nav
});

// Toggle para mostrar/ocultar contraseña
document.querySelector('.toggle-password').addEventListener('click', function () {
    const passwordInput = document.getElementById('register-password');
    const icon = document.getElementById('register-toggle-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye-fill');
        icon.classList.add('bi-eye-slash-fill');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash-fill');
        icon.classList.add('bi-eye-fill');
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const paisSelect = document.getElementById("pais");
    const dniInput = document.getElementById("dni");
    const dniLabel = document.getElementById("dni-label");

    paisSelect.addEventListener("change", function () {
        const pais = paisSelect.value;
        switch (pais) {
            case "Argentina":
                dniLabel.textContent = "DNI";
                dniInput.placeholder = "Ej: 40123456";
                dniInput.maxLength = 8;
                dniInput.pattern = "\\d{7,8}";
                break;
            case "Brasil":
                dniLabel.textContent = "CPF";
                dniInput.placeholder = "Ej: 12345678900";
                dniInput.maxLength = 11;
                dniInput.pattern = "\\d{11}";
                break;
            case "Paraguay":
                dniLabel.textContent = "CI";
                dniInput.placeholder = "Ej: 1234567";
                dniInput.maxLength = 7;
                dniInput.pattern = "\\d{6,7}";
                break;
            case "Uruguay":
                dniLabel.textContent = "Cédula";
                dniInput.placeholder = "Ej: 12345678";
                dniInput.maxLength = 8;
                dniInput.pattern = "\\d{7,8}";
                break;
            default:
                dniLabel.textContent = "Documento";
                dniInput.placeholder = "Ingrese su documento";
                dniInput.removeAttribute("maxLength");
                dniInput.removeAttribute("pattern");
                break;
        }
    });
});

function renderVehicles(vehicles) {
    const container = document.getElementById('vehicle-container');
    container.innerHTML = '';
    vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
      <div class="card h-100 shadow">
        <img src="${vehicle.image}" class="card-img-top" alt="${vehicle.model}">
        <div class="card-body">
          <h5 class="card-title">${vehicle.model}</h5>
          <p class="card-text">Precio por día: $${vehicle.pricePerDay}</p>
          <button class="btn btn-primary">Reservar</button>
        </div>
      </div>
    `;
        container.appendChild(card);
    });
}

// Ejecutar cuando se cargue la página o cuando se muestre la sección
renderVehicles(vehicles);
document.addEventListener('DOMContentLoaded', () => {
    renderVehicles(vehicles);
});

const vehicles = [
    {
        id: 1,
        model: 'Fiat Cronos 2023',
        pricePerDay: 15000,
        image: 'https://acroadtrip.blob.core.windows.net/catalogo-imagenes/xl/RT_V_1c344ad327f849109733ef6f1a4e9ad6.jpg'
    },
    {
        id: 2,
        model: 'Fiat Cronos Precision',
        pricePerDay: 17000,
        image: 'https://www.fiat.com.ar/content/dam/fiat/products/cronos/gallery/Cronos_Galeria_3.jpg'
    },
    {
        id: 3,
        model: 'Fiat Cronos Drive Pack Confort',
        pricePerDay: 16000,
        image: 'https://www.fiat.com.ar/content/dam/fiat/products/cronos/gallery/Cronos_Galeria_1.jpg'
    }
];

function renderVehicles(vehicles) {
    const container = document.getElementById('vehicle-container');
    container.innerHTML = '';
    vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
      <div class="card neon-card h-100 text-white">
        <img src="${vehicle.image}" class="card-img-top" alt="${vehicle.model}">
        <div class="card-body">
          <h5 class="card-title">${vehicle.model}</h5>
          <p class="card-text">Precio por día: $${vehicle.pricePerDay.toLocaleString()}</p>
          <button class="btn neon-btn w-100" onclick="handleReservar(${vehicle.id})">Alquilar</button>
        </div>
      </div>
    `;
        container.appendChild(card);
    });
}

// Simulación de sesión (reemplazá con tu lógica real)
function isLoggedIn() {
    return localStorage.getItem("usuario") !== null;
}

function handleReservar(idVehiculo) {
    if (!isLoggedIn()) {
        alert("Por favor, iniciá sesión para alquilar un vehículo.");
        // Mostrar la sección de login
        document.getElementById("login-section").classList.remove("hide");
        document.getElementById("fleet-section").classList.add("hide");
        // Si usás navegación con botones, activá el botón de login:
        const loginLink = document.getElementById("login-link");
        if (loginLink) loginLink.classList.add("active");
        return;
    }

    // Si está logueado, mostrar modal o redirigir al detalle/reserva
    alert("Vehículo seleccionado: " + idVehiculo);
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", () => {
    renderVehicles(vehicles);
});
