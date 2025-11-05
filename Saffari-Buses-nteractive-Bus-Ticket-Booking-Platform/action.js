document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const bookingForm = document.getElementById('bookingForm');
            const busListSection = document.getElementById('busListSection');
            const busList = document.getElementById('busList');
            const seatSelection = document.getElementById('seatSelection');
            const seatLayout = document.getElementById('seatLayout');
            const selectedSeatsCount = document.getElementById('selectedSeatsCount');
            const selectedSeatsPrice = document.getElementById('selectedSeatsPrice');
            const cancelSeatSelectionBtn = document.getElementById('cancelSeatSelection');
            const proceedToPaymentBtn = document.getElementById('proceedToPayment');
            const paymentModal = document.getElementById('paymentModal');
            const closePaymentModal = document.getElementById('closePaymentModal');
            const cancelPaymentBtn = document.getElementById('cancelPayment');
            const confirmPaymentBtn = document.getElementById('confirmPayment');
            const paymentAmount = document.getElementById('paymentAmount');
            const ticketModal = document.getElementById('ticketModal');
            const closeTicketModal = document.getElementById('closeTicketModal');
            const closeTicketBtn = document.getElementById('closeTicketBtn');
            const printTicketBtn = document.getElementById('printTicketBtn');
            const downloadTicketBtn = document.getElementById('downloadTicketBtn');
            const ticketDetails = document.getElementById('ticketDetails');
            const loginModal = document.getElementById('loginModal');
            const signupModal = document.getElementById('signupModal');
            const closeLoginModal = document.getElementById('closeLoginModal');
            const closeSignupModal = document.getElementById('closeSignupModal');
            const showSignup = document.getElementById('showSignup');
            const showLogin = document.getElementById('showLogin');
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            const loginBtn = document.getElementById('loginBtn');
            const signupBtn = document.getElementById('signupBtn');
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const applyOfferButtons = document.querySelectorAll('.apply-offer');
            const popularRouteButtons = document.querySelectorAll('.route-card button');
            const passengerSelect = document.getElementById('passengers');
            const decreasePassengersBtn = document.getElementById('decreasePassengers');
            const increasePassengersBtn = document.getElementById('increasePassengers');
            const passengerCount = document.getElementById('passengerCount');
            const passengerLimitMessage = document.getElementById('passengerLimitMessage');
            const paymentMethods = document.querySelectorAll('.payment-method');
            const paymentForms = document.querySelectorAll('.payment-form');
            
            // Form validation elements
            const fromInput = document.getElementById('from');
            const toInput = document.getElementById('to');
            const dateInput = document.getElementById('date');
            const fromError = document.getElementById('fromError');
            const toError = document.getElementById('toError');
            const dateError = document.getElementById('dateError');
            
            // Login form elements
            const loginEmailInput = document.getElementById('loginEmail');
            const loginPasswordInput = document.getElementById('loginPassword');
            const loginEmailError = document.getElementById('loginEmailError');
            const loginPasswordError = document.getElementById('loginPasswordError');
            
            // Signup form elements
            const signupNameInput = document.getElementById('signupName');
            const signupEmailInput = document.getElementById('signupEmail');
            const signupPasswordInput = document.getElementById('signupPassword');
            const signupConfirmPasswordInput = document.getElementById('signupConfirmPassword');
            const signupNameError = document.getElementById('signupNameError');
            const signupEmailError = document.getElementById('signupEmailError');
            const signupPasswordError = document.getElementById('signupPasswordError');
            const signupConfirmPasswordError = document.getElementById('signupConfirmPasswordError');

            // State variables
            let selectedBus = null;
            let selectedSeats = [];
            let currentUser = null;
            let currentPassengerCount = 1;
            let maxPassengers = 5;
            let selectedPaymentMethod = null;
            
            // Sample bus data
            const BUS_DATA = [
                { id: 1, name: "Saffari A/C Sleeper", type: "A/C Sleeper", rating: 4.5, fare: 1299, totalSeats: 36, amenities: ["WiFi", "Charging Ports", "Blanket"] },
                { id: 2, name: "Luxury Non-A/C Seater", type: "Non-A/C Seater", rating: 3.8, fare: 899, totalSeats: 40, amenities: ["Charging Ports", "Water Bottle"] },
                { id: 3, name: "VIP Multi-Axle", type: "A/C Seater", rating: 4.9, fare: 1599, totalSeats: 32, amenities: ["WiFi", "Charging Ports", "Meals", "Entertainment"] },
            ];

            // Initialize the page
            function initializePage() {
                // Set default date to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateInput.value = tomorrow.toISOString().split('T')[0];
                dateInput.min = tomorrow.toISOString().split('T')[0]; // Prevent past date selection
                
                // Check if user is logged in
                checkUserLoginStatus();
                
                // Start offer countdown timer
                startOfferCountdown();
                
                // Initialize passenger controls
                initializePassengerControls();
                
                // Initialize payment methods
                initializePaymentMethods();
                
                // Show welcome notification
                setTimeout(() => {
                    showNotification('Welcome to Saffari Buses! Your journey starts here.', 'success');
                }, 1000);
            }
            
            // Initialize passenger controls
            function initializePassengerControls() {
                currentPassengerCount = 1;
                passengerCount.textContent = currentPassengerCount;
                
                decreasePassengersBtn.addEventListener('click', decreasePassengers);
                increasePassengersBtn.addEventListener('click', increasePassengers);
            }
            
            // Decrease passenger count
            function decreasePassengers() {
                if (currentPassengerCount > 1) {
                    currentPassengerCount--;
                    passengerCount.textContent = currentPassengerCount;
                    updatePassengerControls();
                    checkSeatSelection();
                }
            }
            
            // Increase passenger count
            function increasePassengers() {
                if (currentPassengerCount < maxPassengers) {
                    currentPassengerCount++;
                    passengerCount.textContent = currentPassengerCount;
                    updatePassengerControls();
                    checkSeatSelection();
                }
            }
            
            // Update passenger controls state
            function updatePassengerControls() {
                decreasePassengersBtn.disabled = currentPassengerCount <= 1;
                increasePassengersBtn.disabled = currentPassengerCount >= maxPassengers;
            }
            
            // Check seat selection against passenger count
            function checkSeatSelection() {
                if (selectedSeats.length > currentPassengerCount) {
                    // Remove excess seats
                    const excessSeats = selectedSeats.length - currentPassengerCount;
                    for (let i = 0; i < excessSeats; i++) {
                        const seatId = selectedSeats.pop();
                        const seatElement = document.querySelector(`.seat[data-seat-id="${seatId}"]`);
                        if (seatElement) {
                            seatElement.classList.remove('selected');
                        }
                    }
                    updateSeatSummary();
                    showNotification(`Seat selection adjusted to ${currentPassengerCount} passenger(s).`, 'info');
                }
            }
            
            // Initialize payment methods
            function initializePaymentMethods() {
                paymentMethods.forEach(method => {
                    method.addEventListener('click', function() {
                        // Remove selected class from all methods
                        paymentMethods.forEach(m => m.classList.remove('selected'));
                        // Add selected class to clicked method
                        this.classList.add('selected');
                        
                        // Get payment method
                        selectedPaymentMethod = this.getAttribute('data-method');
                        
                        // Hide all payment forms
                        paymentForms.forEach(form => form.classList.remove('active'));
                        
                        // Show selected payment form
                        const selectedForm = document.getElementById(`${selectedPaymentMethod}Form`);
                        if (selectedForm) {
                            selectedForm.classList.add('active');
                        }
                    });
                });
            }
            
            // Check if user is logged in
            function checkUserLoginStatus() {
                const user = localStorage.getItem('currentUser');
                if (user) {
                    currentUser = JSON.parse(user);
                    updateAuthButtons();
                }
            }
            
            // Update authentication buttons based on login status
            function updateAuthButtons() {
                if (currentUser) {
                    loginBtn.textContent = currentUser.name;
                    signupBtn.textContent = 'Logout';
                    
                    // Update event listeners
                    loginBtn.removeEventListener('click', openLoginModal);
                    signupBtn.removeEventListener('click', openSignupModal);
                    
                    loginBtn.addEventListener('click', showUserProfile);
                    signupBtn.addEventListener('click', logoutUser);
                } else {
                    loginBtn.textContent = 'Log in';
                    signupBtn.textContent = 'Sign up';
                    
                    // Update event listeners
                    loginBtn.removeEventListener('click', showUserProfile);
                    signupBtn.removeEventListener('click', logoutUser);
                    
                    loginBtn.addEventListener('click', openLoginModal);
                    signupBtn.addEventListener('click', openSignupModal);
                }
            }
            
            // Show user profile (placeholder)
            function showUserProfile() {
                showNotification(`Welcome back, ${currentUser.name}!`, 'success');
            }
            
            // Logout user
            function logoutUser() {
                localStorage.removeItem('currentUser');
                currentUser = null;
                updateAuthButtons();
                showNotification('You have been logged out successfully.', 'success');
            }
            
            // Start offer countdown timer
            function startOfferCountdown() {
                const countdownDate = new Date();
                countdownDate.setDate(countdownDate.getDate() + 2); // 2 days from now
                countdownDate.setHours(12, 45, 30, 0); // Set to 12:45:30
                
                function updateCountdown() {
                    const now = new Date().getTime();
                    const distance = countdownDate.getTime() - now;
                    
                    if (distance < 0) {
                        // Countdown finished
                        document.getElementById('days').textContent = '00';
                        document.getElementById('hours').textContent = '00';
                        document.getElementById('minutes').textContent = '00';
                        document.getElementById('seconds').textContent = '00';
                        return;
                    }
                    
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    document.getElementById('days').textContent = days.toString().padStart(2, '0');
                    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
                }
                
                updateCountdown();
                setInterval(updateCountdown, 1000);
            }
            
            // Show notification
            function showNotification(message, type = 'success') {
                notificationText.textContent = message;
                
                // Set icon based on type
                const icon = notification.querySelector('.notification-icon i');
                if (type === 'success') {
                    icon.className = 'fas fa-check-circle';
                    icon.style.color = 'var(--success)';
                } else if (type === 'error') {
                    icon.className = 'fas fa-exclamation-circle';
                    icon.style.color = 'var(--primary)';
                } else {
                    icon.className = 'fas fa-info-circle';
                    icon.style.color = 'var(--warning)';
                }
                
                notification.classList.add('show');
                
                // Auto hide after 3 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
            
            // Show loading spinner
            function showSpinner() {
                loadingSpinner.style.display = 'block';
            }
            
            // Hide loading spinner
            function hideSpinner() {
                loadingSpinner.style.display = 'none';
            }
            
            // Validate email format
            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            // Format date for display
            function formatDate(dateString) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('en-US', options);
            }
            
            // Generate random booking ID
            function generateBookingId() {
                return 'SB' + Math.random().toString(36).substr(2, 9).toUpperCase();
            }
            
            // Render bus list based on search
            function renderBusList(from, to, date) {
                busList.innerHTML = '';
                
                // Filter buses (in a real app, this would be an API call)
                const searchResults = BUS_DATA.map(bus => ({
                    ...bus,
                    departure: getRandomTime(),
                    arrival: getRandomTime(),
                    seats: getRandomSeats(bus.totalSeats),
                    from: from,
                    to: to,
                    date: date,
                    duration: `${Math.floor(Math.random() * 5) + 6}h ${Math.floor(Math.random() * 60)}m`
                }));
                
                if (searchResults.length === 0) {
                    busList.innerHTML = '<p class="no-results">No buses found for this route and date. Please try a different search.</p>';
                    return;
                }
                
                // Create bus cards
                searchResults.forEach(bus => {
                    const card = document.createElement('div');
                    card.className = 'bus-card';
                    card.innerHTML = `
                        <h3>${bus.name}</h3>
                        <p><i class="fas fa-star" style="color: var(--warning);"></i> ${bus.rating} • ${bus.type}</p>
                        <p><i class="fas fa-clock"></i> ${bus.departure} - ${bus.arrival} (${bus.duration})</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${bus.from} → ${bus.to}</p>
                        <p><i class="fas fa-users"></i> ${bus.seats} seats available</p>
                        <p><strong>₹${bus.fare.toLocaleString('en-IN')}</strong></p>
                        <button class="btn btn-primary select-bus" data-bus-id="${bus.id}">Select Seats</button>
                    `;
                    busList.appendChild(card);
                });
                
                // Add event listeners to select bus buttons
                document.querySelectorAll('.select-bus').forEach(button => {
                    button.addEventListener('click', function() {
                        const busId = parseInt(this.getAttribute('data-bus-id'));
                        selectedBus = searchResults.find(b => b.id === busId);
                        openSeatSelection(selectedBus);
                    });
                });
            }
            
            // Get random time
            function getRandomTime() {
                const hours = Math.floor(Math.random() * 12) + 6; // Between 6 AM and 6 PM
                const minutes = Math.floor(Math.random() * 60);
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours % 12 || 12;
                return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            }
            
            // Get random number of seats
            function getRandomSeats(maxSeats) {
                return Math.floor(Math.random() * (maxSeats - 5)) + 5; // At least 5 seats available
            }
            
            // Open seat selection
            function openSeatSelection(bus) {
                selectedSeats = [];
                updateSeatSummary();
                
                // Hide bus list and show seat selection
                busListSection.style.display = 'none';
                seatSelection.style.display = 'block';
                
                // Scroll to seat selection
                seatSelection.scrollIntoView({ behavior: 'smooth' });
                
                // Generate seat layout
                generateSeatLayout(bus.totalSeats, bus.seats);
            }
            
            // Generate seat layout
            function generateSeatLayout(totalSeats, availableSeats) {
                seatLayout.innerHTML = '';
                
                const occupiedSeats = totalSeats - availableSeats;
                let occupiedIndices = new Set();
                
                // Randomly select occupied seats
                while (occupiedIndices.size < occupiedSeats) {
                    occupiedIndices.add(Math.floor(Math.random() * totalSeats));
                }
                
                // Create seats
                for (let i = 0; i < totalSeats; i++) {
                    const seat = document.createElement('div');
                    seat.className = 'seat';
                    seat.textContent = i + 1;
                    seat.setAttribute('data-seat-id', i + 1);
                    
                    if (occupiedIndices.has(i)) {
                        seat.classList.add('occupied');
                    } else {
                        seat.addEventListener('click', toggleSeatSelection);
                    }
                    
                    seatLayout.appendChild(seat);
                }
            }
            
            // Toggle seat selection
            function toggleSeatSelection() {
                const seatId = this.getAttribute('data-seat-id');
                
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                    selectedSeats = selectedSeats.filter(id => id !== seatId);
                } else {
                    // Check if we've reached the passenger limit
                    if (selectedSeats.length >= currentPassengerCount) {
                        showNotification(`You can only select ${currentPassengerCount} seat(s) for ${currentPassengerCount} passenger(s).`, 'error');
                        return;
                    }
                    
                    this.classList.add('selected');
                    selectedSeats.push(seatId);
                }
                
                updateSeatSummary();
            }
            
            // Update seat selection summary
            function updateSeatSummary() {
                const totalPrice = selectedSeats.length * (selectedBus ? selectedBus.fare : 0);
                selectedSeatsCount.textContent = selectedSeats.length;
                selectedSeatsPrice.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
            }
            
            // Open payment modal
            function openPaymentModal() {
                if (selectedSeats.length === 0) {
                    showNotification('Please select at least one seat to proceed.', 'error');
                    return;
                }
                
                if (selectedSeats.length !== currentPassengerCount) {
                    showNotification(`Please select exactly ${currentPassengerCount} seat(s) for ${currentPassengerCount} passenger(s).`, 'error');
                    return;
                }
                
                if (!currentUser) {
                    showNotification('Please log in to complete your booking.', 'error');
                    openLoginModal();
                    return;
                }
                
                // Calculate total amount
                const totalAmount = selectedSeats.length * selectedBus.fare;
                paymentAmount.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
                
                // Show payment modal
                seatSelection.style.display = 'none';
                paymentModal.style.display = 'flex';
            }
            
            // Process payment (simulated)
            function processPayment() {
                if (!selectedPaymentMethod) {
                    showNotification('Please select a payment method.', 'error');
                    return;
                }
                
                // Validate payment details based on selected method
                if (selectedPaymentMethod === 'card') {
                    const cardNumber = document.getElementById('cardNumber').value;
                    const cardName = document.getElementById('cardName').value;
                    const expiryDate = document.getElementById('expiryDate').value;
                    const cvv = document.getElementById('cvv').value;
                    
                    if (!cardNumber || !cardName || !expiryDate || !cvv) {
                        showNotification('Please fill in all card details.', 'error');
                        return;
                    }
                } else if (selectedPaymentMethod === 'upi') {
                    const upiId = document.getElementById('upiId').value;
                    if (!upiId) {
                        showNotification('Please enter your UPI ID.', 'error');
                        return;
                    }
                } else if (selectedPaymentMethod === 'netbanking') {
                    const bankSelect = document.getElementById('bankSelect').value;
                    if (!bankSelect) {
                        showNotification('Please select your bank.', 'error');
                        return;
                    }
                } else if (selectedPaymentMethod === 'wallet') {
                    const walletSelect = document.getElementById('walletSelect').value;
                    if (!walletSelect) {
                        showNotification('Please select your wallet.', 'error');
                        return;
                    }
                }
                
                showSpinner();
                
                // Simulate payment processing
                setTimeout(() => {
                    hideSpinner();
                    paymentModal.style.display = 'none';
                    showTicketConfirmation();
                }, 2000);
            }
            
            // Show ticket confirmation
            function showTicketConfirmation() {
                const bookingId = generateBookingId();
                const totalFare = selectedSeats.length * selectedBus.fare;
                const tax = totalFare * 0.05;
                const grandTotal = totalFare + tax;
                
                // Update ticket details
                document.getElementById('ticketBookingId').textContent = bookingId;
                document.getElementById('ticketPassengerName').textContent = currentUser.name;
                document.getElementById('ticketRoute').textContent = `${selectedBus.from} to ${selectedBus.to}`;
                document.getElementById('ticketDate').textContent = formatDate(selectedBus.date);
                document.getElementById('ticketDeparture').textContent = selectedBus.departure;
                document.getElementById('ticketSeats').textContent = selectedSeats.join(', ');
                document.getElementById('ticketAmount').textContent = `₹${grandTotal.toFixed(2)}`;
                
                // Show ticket modal
                ticketModal.style.display = 'flex';
                
                // Show success notification
                showNotification('Payment successful! Your ticket has been booked.', 'success');
            }
            
            // Open login modal
            function openLoginModal() {
                loginModal.style.display = 'flex';
            }
            
            // Open signup modal
            function openSignupModal() {
                signupModal.style.display = 'flex';
            }
            
            // Close modal
            function closeModal(modal) {
                modal.style.display = 'none';
            }
            
            // Event Listeners
            
            // Booking form submission
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let valid = true;
                
                // Reset errors
                fromError.style.display = 'none';
                toError.style.display = 'none';
                dateError.style.display = 'none';
                
                // Validate form
                if (fromInput.value.trim() === '') {
                    fromError.textContent = 'Please enter origin city.';
                    fromError.style.display = 'block';
                    valid = false;
                }
                
                if (toInput.value.trim() === '') {
                    toError.textContent = 'Please enter destination city.';
                    toError.style.display = 'block';
                    valid = false;
                }
                
                if (fromInput.value.trim().toLowerCase() === toInput.value.trim().toLowerCase() && fromInput.value.trim() !== '') {
                    fromError.textContent = 'Origin and destination cannot be the same.';
                    fromError.style.display = 'block';
                    valid = false;
                }
                
                if (dateInput.value.trim() === '') {
                    dateError.textContent = 'Please select a date.';
                    dateError.style.display = 'block';
                    valid = false;
                }
                
                if (valid) {
                    showSpinner();
                    
                    // Simulate API call
                    setTimeout(() => {
                        hideSpinner();
                        renderBusList(fromInput.value, toInput.value, dateInput.value);
                        busListSection.style.display = 'block';
                        busListSection.scrollIntoView({ behavior: 'smooth' });
                    }, 1500);
                }
            });
            
            // Cancel seat selection
            cancelSeatSelectionBtn.addEventListener('click', function() {
                seatSelection.style.display = 'none';
                busListSection.style.display = 'block';
            });
            
            // Proceed to payment
            proceedToPaymentBtn.addEventListener('click', openPaymentModal);
            
            // Cancel payment
            cancelPaymentBtn.addEventListener('click', function() {
                closeModal(paymentModal);
                seatSelection.style.display = 'block';
            });
            
            // Close payment modal
            closePaymentModal.addEventListener('click', function() {
                closeModal(paymentModal);
                seatSelection.style.display = 'block';
            });
            
            // Confirm payment
            confirmPaymentBtn.addEventListener('click', processPayment);
            
            // Close ticket modal
            closeTicketModal.addEventListener('click', function() {
                closeModal(ticketModal);
            });
            
            closeTicketBtn.addEventListener('click', function() {
                closeModal(ticketModal);
            });
            
            // Print ticket
            printTicketBtn.addEventListener('click', function() {
                showNotification('Ticket printing functionality would be implemented here.', 'info');
            });
            
            // Download ticket
            downloadTicketBtn.addEventListener('click', function() {
                showNotification('Ticket download functionality would be implemented here.', 'info');
            });
            
            // Close modals when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target === paymentModal) {
                    closeModal(paymentModal);
                    seatSelection.style.display = 'block';
                }
                if (e.target === ticketModal) {
                    closeModal(ticketModal);
                }
                if (e.target === loginModal) {
                    closeModal(loginModal);
                }
                if (e.target === signupModal) {
                    closeModal(signupModal);
                }
            });
            
            // Close login modal
            closeLoginModal.addEventListener('click', function() {
                closeModal(loginModal);
            });
            
            // Close signup modal
            closeSignupModal.addEventListener('click', function() {
                closeModal(signupModal);
            });
            
            // Show signup modal from login
            showSignup.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal(loginModal);
                openSignupModal();
            });
            
            // Show login modal from signup
            showLogin.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal(signupModal);
                openLoginModal();
            });
            
            // Login form submission
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let valid = true;
                
                // Reset errors
                loginEmailError.style.display = 'none';
                loginPasswordError.style.display = 'none';
                
                // Validate form
                if (!validateEmail(loginEmailInput.value.trim())) {
                    loginEmailError.textContent = 'Please enter a valid email address.';
                    loginEmailError.style.display = 'block';
                    valid = false;
                }
                
                if (loginPasswordInput.value.trim().length < 6) {
                    loginPasswordError.textContent = 'Password must be at least 6 characters.';
                    loginPasswordError.style.display = 'block';
                    valid = false;
                }
                
                if (valid) {
                    // In a real app, this would be an API call to authenticate
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const user = users.find(u => u.email === loginEmailInput.value.trim() && u.password === loginPasswordInput.value.trim());
                    
                    if (user) {
                        currentUser = user;
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        updateAuthButtons();
                        closeModal(loginModal);
                        showNotification('Login successful!', 'success');
                    } else {
                        showNotification('Invalid email or password. Please try again.', 'error');
                    }
                }
            });
            
            // Signup form submission
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let valid = true;
                
                // Reset errors
                signupNameError.style.display = 'none';
                signupEmailError.style.display = 'none';
                signupPasswordError.style.display = 'none';
                signupConfirmPasswordError.style.display = 'none';
                
                // Validate form
                if (signupNameInput.value.trim().length < 2) {
                    signupNameError.textContent = 'Name must be at least 2 characters.';
                    signupNameError.style.display = 'block';
                    valid = false;
                }
                
                if (!validateEmail(signupEmailInput.value.trim())) {
                    signupEmailError.textContent = 'Please enter a valid email address.';
                    signupEmailError.style.display = 'block';
                    valid = false;
                } else {
                    // Check if email already exists
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    if (users.some(u => u.email === signupEmailInput.value.trim())) {
                        signupEmailError.textContent = 'This email is already registered.';
                        signupEmailError.style.display = 'block';
                        valid = false;
                    }
                }
                
                if (signupPasswordInput.value.trim().length < 6) {
                    signupPasswordError.textContent = 'Password must be at least 6 characters.';
                    signupPasswordError.style.display = 'block';
                    valid = false;
                }
                
                if (signupPasswordInput.value.trim() !== signupConfirmPasswordInput.value.trim()) {
                    signupConfirmPasswordError.textContent = 'Passwords do not match.';
                    signupConfirmPasswordError.style.display = 'block';
                    valid = false;
                }
                
                if (valid) {
                    // Create new user
                    const newUser = {
                        id: Date.now().toString(),
                        name: signupNameInput.value.trim(),
                        email: signupEmailInput.value.trim(),
                        password: signupPasswordInput.value.trim() // In a real app, this would be hashed
                    };
                    
                    // Save user to localStorage
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    // Log the user in
                    currentUser = newUser;
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    updateAuthButtons();
                    
                    closeModal(signupModal);
                    showNotification('Account created successfully!', 'success');
                }
            });
            
            // Apply offer buttons
            applyOfferButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const code = this.getAttribute('data-code');
                    showNotification(`Coupon code "${code}" applied successfully!`, 'success');
                });
            });
            
            // Popular route buttons
            popularRouteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const route = this.getAttribute('data-route');
                    const parts = route.split(' to ');
                    
                    if (parts.length === 2) {
                        fromInput.value = parts[0];
                        toInput.value = parts[1];
                        showNotification(`Popular route "${route}" selected! Click "Search Buses" to continue.`, 'info');
                    }
                });
            });
            
            // Initialize the page
            initializePage();
        });
    