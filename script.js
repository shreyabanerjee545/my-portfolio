// --- User-Friendly Responsive Mobile Navigation Drawer Logic ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close drawer automatically once a section is targeting/clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- Dynamic Text Typing Loops ---
const roles = [
    "Full Stack Developer.",
    "Web Developer.",
    "Creative Problem Solver."
];
let roleIndex = 0;
let characterTimer;

function handleTyping() {
    let charArr = roles[roleIndex].split("");
    var loopCharacters = function() {
        if (charArr.length > 0) {
            document.querySelector('.typing-text').innerHTML += charArr.shift();
        } else {
            setTimeout(handleErasure, 2000);
            return false;
        }
        characterTimer = setTimeout(loopCharacters, 95);
    };
    loopCharacters();
}

function handleErasure() {
    let charArr = roles[roleIndex].split("");
    var loopErasure = function() {
        if (charArr.length > 0) {
            charArr.pop();
            document.querySelector('.typing-text').innerHTML = charArr.join("");
        } else {
            roleIndex = (roles.length > (roleIndex + 1)) ? roleIndex + 1 : 0;
            setTimeout(handleTyping, 500);
            return false;
        }
        characterTimer = setTimeout(loopErasure, 45);
    };
    loopErasure();
}

document.addEventListener("DOMContentLoaded", () => {
    handleTyping();
    initScrollReveal();
    initProfilePhotoChanger();
    initDemoModal();
});

// --- Active Nav Item State Tracker on User Scroll Events ---
const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let currentActiveId = '';
    sections.forEach(section => {
        const topDistance = section.offsetTop;
        const heightDistance = section.clientHeight;
        if (pageYOffset >= (topDistance - heightDistance / 3.5)) {
            currentActiveId = section.getAttribute('id');
        }
    });

    links.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(currentActiveId)) {
            a.classList.add('active');
        }
    });
});

// --- User Action Feedback Verification logic ---
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const clientName = document.getElementById('name').value;
    alert(`Thank you for reaching out, ${clientName}! Your message was simulated successfully.`);
    this.reset();
});

// ==========================================
// NEW FEATURES: SCROLL-DOWN SENSORS & INTERACTIVITY
// ==========================================

// --- 1. Scroll-Down Reveal Sensors ---
function initScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll('.reveal-on-scroll, .reveal-slide-left, .reveal-slide-right, .reveal-zoom-in').forEach(element => {
        revealObserver.observe(element);
    });
}

// --- 2. Interactive Profile Photo Changer (FileReader & LocalStorage) ---
function initProfilePhotoChanger() {
    const trigger = document.getElementById('profile-card-trigger');
    const fileInput = document.getElementById('profile-upload');
    const imgPreview = document.getElementById('profile-img-preview');
    const resetBtn = document.getElementById('profile-reset');

    // Load saved photo on startup
    const savedPhoto = localStorage.getItem('profile_photo');
    if (savedPhoto) {
        imgPreview.src = savedPhoto;
        resetBtn.style.display = 'block';
    }

    trigger.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is image
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(evt) {
                const base64Str = evt.target.result;
                localStorage.setItem('profile_photo', base64Str);
                imgPreview.src = base64Str;
                resetBtn.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering upload dialog
        localStorage.removeItem('profile_photo');
        imgPreview.src = 'profile.jpeg';
        resetBtn.style.display = 'none';
        fileInput.value = ''; // clear input cache
    });
}

// --- 3. Live Demo Modal Handlers & Navigation ---
function initDemoModal() {
    const modal = document.getElementById('demo-modal');
    const closeBtn = document.getElementById('modal-close');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const widgets = document.querySelectorAll('.demo-widget');

    document.querySelectorAll('.btn-demo').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectType = btn.getAttribute('data-project');
            
            // Hide all widgets
            widgets.forEach(w => w.classList.remove('active'));
            
            // Show selected widget & set metadata
            if (projectType === 'todo') {
                title.textContent = 'To-Do List & Task Manager';
                subtitle.textContent = 'Organize goals with persistent local storage';
                document.getElementById('todo-widget').classList.add('active');
                renderTodoWidget();
            } else if (projectType === 'dates') {
                title.textContent = 'Multiple Dates Timeline Tool';
                subtitle.textContent = 'Track and delay date milestones in structured view';
                document.getElementById('dates-widget').classList.add('active');
                renderDatesWidget();
            } else if (projectType === 'doctor') {
                title.textContent = 'Appointment Booking System';
                subtitle.textContent = 'Dynamic slot handling and calendar reservation';
                document.getElementById('doctor-widget').classList.add('active');
                renderDoctorWidget();
            } else if (projectType === 'finance') {
                title.textContent = 'Struggle - Financial Tracker';
                subtitle.textContent = 'Manage income, check expenses, and view savings rates';
                document.getElementById('finance-widget').classList.add('active');
                renderFinanceWidget();
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // lock scroll
        });
    });

    // Close modal actions
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // unlock scroll
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// --- Widget 1: To-Do App Logic ---
function renderTodoWidget() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('todo-add-btn');
    const todoList = document.getElementById('todo-list');

    let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [
        { id: 1, text: "Build premium developer portfolio", completed: true },
        { id: 2, text: "Implement scroll sensors and local storage", completed: true },
        { id: 3, text: "Design interactive project demos", completed: false }
    ];

    const save = () => localStorage.setItem('todo_tasks', JSON.stringify(tasks));

    const draw = () => {
        todoList.innerHTML = '';
        if (tasks.length === 0) {
            todoList.innerHTML = '<div class="todo-empty-state">No tasks available. Add some goals above!</div>';
            return;
        }

        tasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `todo-item ${task.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="todo-item-left">
                    <div class="todo-checkbox">
                        <i class="fas fa-check"></i>
                    </div>
                    <span class="todo-text">${escapeHTML(task.text)}</span>
                </div>
                <div class="todo-actions">
                    <button class="edit-btn"><i class="fas fa-pen"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;

            // checkbox toggle
            item.querySelector('.todo-checkbox').addEventListener('click', () => {
                task.completed = !task.completed;
                save();
                draw();
            });

            // edit description
            item.querySelector('.edit-btn').addEventListener('click', () => {
                const newText = prompt("Edit your task:", task.text);
                if (newText !== null && newText.trim() !== "") {
                    task.text = newText.trim();
                    save();
                    draw();
                }
            });

            // delete
            item.querySelector('.delete-btn').addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                save();
                draw();
            });

            todoList.appendChild(item);
        });
    };

    // Add task
    const triggerAdd = () => {
        const text = todoInput.value.trim();
        if (text) {
            tasks.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            todoInput.value = '';
            save();
            draw();
        }
    };

    addBtn.onclick = triggerAdd;
    todoInput.onkeypress = (e) => {
        if (e.key === 'Enter') triggerAdd();
    };

    draw();
}

// --- Widget 2: Multiple Dates Tool ---
function renderDatesWidget() {
    const dateSelect = document.getElementById('date-select');
    const delayInput = document.getElementById('delay-input');
    const addBtn = document.getElementById('date-add-btn');
    const shiftBtn = document.getElementById('date-shift-btn');
    const datesList = document.getElementById('dates-list');

    // Initialize date selects to today's date
    const todayStr = new Date().toISOString().split('T')[0];
    dateSelect.value = todayStr;

    let dates = JSON.parse(localStorage.getItem('widget_dates')) || [
        { id: 1, original: todayStr, adjusted: todayStr, delay: 0 }
    ];

    const save = () => localStorage.setItem('widget_dates', JSON.stringify(dates));

    const draw = () => {
        datesList.innerHTML = '';
        if (dates.length === 0) {
            datesList.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-soft); font-style: italic;">Timeline is empty. Add a date to get started!</td></tr>';
            return;
        }

        dates.forEach(item => {
            const tr = document.createElement('tr');
            
            let delayTag = '';
            if (item.delay > 0) {
                delayTag = ` <span style="color: #10b981; font-size: 0.75rem;">(+${item.delay}d)</span>`;
            } else if (item.delay < 0) {
                delayTag = ` <span style="color: #ef4444; font-size: 0.75rem;">(${item.delay}d)</span>`;
            }

            tr.innerHTML = `
                <td>${item.original}</td>
                <td>${item.adjusted}${delayTag}</td>
                <td><button class="del-date-btn"><i class="fas fa-trash-alt"></i> Delete</button></td>
            `;

            tr.querySelector('.del-date-btn').onclick = () => {
                dates = dates.filter(d => d.id !== item.id);
                save();
                draw();
            };

            datesList.appendChild(tr);
        });
    };

    addBtn.onclick = () => {
        const val = dateSelect.value;
        const delay = parseInt(delayInput.value) || 0;
        
        if (val) {
            const originalDateObj = new Date(val);
            const adjustedDateObj = new Date(val);
            adjustedDateObj.setDate(originalDateObj.getDate() + delay);
            
            dates.push({
                id: Date.now(),
                original: val,
                adjusted: adjustedDateObj.toISOString().split('T')[0],
                delay: delay
            });
            save();
            draw();
        }
    };

    shiftBtn.onclick = () => {
        const delay = parseInt(delayInput.value) || 0;
        if (dates.length > 0) {
            dates = dates.map(item => {
                const originalDateObj = new Date(item.original);
                const adjustedDateObj = new Date(item.original);
                adjustedDateObj.setDate(originalDateObj.getDate() + delay);
                return {
                    ...item,
                    adjusted: adjustedDateObj.toISOString().split('T')[0],
                    delay: delay
                };
            });
            save();
            draw();
        } else {
            alert('Please add at least one date to shift.');
        }
    };

    draw();
}

// --- Widget 3: Doctor Appointment Booking ---
function renderDoctorWidget() {
    const serviceOptions = document.querySelectorAll('.service-option');
    const appointmentDate = document.getElementById('appointment-date');
    const slotsGrid = document.getElementById('slots-grid-container');
    const bookingForm = document.querySelector('.appointment-form');
    const submitBtn = document.getElementById('appointment-submit-btn');
    const stepContainer = document.querySelector('.appointment-widget .step-container');

    // Default service choice
    let selectedService = 'General Consultation';
    serviceOptions.forEach(opt => {
        opt.onclick = () => {
            serviceOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedService = opt.getAttribute('data-service');
        };
    });

    // Default date is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    appointmentDate.value = tomorrowStr;
    appointmentDate.min = tomorrowStr; // cannot book past dates

    // Fixed appointment hours
    const availableSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];
    let selectedSlot = null;

    const getBookings = () => JSON.parse(localStorage.getItem('booked_appointments')) || [
        { date: tomorrowStr, slot: "12:00 PM" } // default pre-booked slot
    ];
    const saveBookings = (list) => localStorage.setItem('booked_appointments', JSON.stringify(list));

    const drawSlots = () => {
        slotsGrid.innerHTML = '';
        selectedSlot = null;
        submitBtn.disabled = true;

        const dateVal = appointmentDate.value;
        if (!dateVal) return;

        const bookings = getBookings();
        const bookedHoursForDate = bookings
            .filter(b => b.date === dateVal)
            .map(b => b.slot);

        availableSlots.forEach(slot => {
            const btn = document.createElement('div');
            const isTaken = bookedHoursForDate.includes(slot);
            btn.className = `slot-option ${isTaken ? 'taken' : ''}`;
            btn.textContent = slot;

            if (!isTaken) {
                btn.onclick = () => {
                    document.querySelectorAll('.slot-option').forEach(s => s.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedSlot = slot;
                    submitBtn.disabled = false;
                };
            }

            slotsGrid.appendChild(btn);
        });
    };

    appointmentDate.onchange = drawSlots;

    // Handle Reservation Submit
    submitBtn.onclick = () => {
        const clientName = document.getElementById('appointment-name').value.trim();
        const clientEmail = document.getElementById('appointment-email').value.trim();
        const dateVal = appointmentDate.value;

        if (!clientName || !clientEmail || !dateVal || !selectedSlot) {
            alert('Please fill out all fields and select a slot.');
            return;
        }

        const bookings = getBookings();
        bookings.push({
            service: selectedService,
            date: dateVal,
            slot: selectedSlot,
            name: clientName,
            email: clientEmail
        });
        saveBookings(bookings);

        // Success Card state
        stepContainer.innerHTML = `
            <div class="booking-success-card">
                <i class="fas fa-check-circle"></i>
                <h3>Reservation Confirmed!</h3>
                <p>Scheduled: <strong>${selectedService}</strong> on <strong>${dateVal}</strong> at <strong>${selectedSlot}</strong>.</p>
                <button id="book-another-btn" class="btn" style="margin-top: 10px;">Book Another Slot</button>
            </div>
        `;

        document.getElementById('book-another-btn').onclick = () => {
            // Restore step container html
            stepContainer.innerHTML = `
                <div>
                    <div class="slots-title">1. Select Appointment Type</div>
                    <div class="services-grid">
                        <div class="service-option selected" data-service="General Consultation">
                            <i class="fas fa-user-md"></i>
                            <h4>General</h4>
                        </div>
                        <div class="service-option" data-service="Full Stack Review">
                            <i class="fas fa-laptop-code"></i>
                            <h4>Code Review</h4>
                        </div>
                        <div class="service-option" data-service="Project Discussion">
                            <i class="fas fa-comments"></i>
                            <h4>Discussion</h4>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="slots-title">2. Select Date & Slot</div>
                    <div class="form-group" style="margin-bottom: 12px;">
                        <input type="date" id="appointment-date" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: #fff;">
                    </div>
                    <div class="slots-grid" id="slots-grid-container">
                        <!-- Dynamic slots -->
                    </div>
                </div>
                <div class="appointment-form">
                    <input type="text" id="appointment-name" placeholder="Your Name" required>
                    <input type="email" id="appointment-email" placeholder="Your Email" required>
                    <button id="appointment-submit-btn" class="submit-btn" disabled>Book Appointment</button>
                </div>
            `;
            // Re-bind script logic recursively
            renderDoctorWidget();
        };
    };

    drawSlots();
}

// --- Widget 4: Financial Ledger (Struggle Tracker) ---
function renderFinanceWidget() {
    const finDesc = document.getElementById('fin-desc');
    const finAmount = document.getElementById('fin-amount');
    const finType = document.getElementById('fin-type');
    const addBtn = document.getElementById('fin-add-btn');
    const txList = document.getElementById('fin-tx-list');

    const balText = document.getElementById('fin-balance');
    const incText = document.getElementById('fin-income');
    const expText = document.getElementById('fin-expense');
    const savingsText = document.getElementById('fin-savings-pct');
    const chartCircle = document.getElementById('fin-chart');

    let transactions = JSON.parse(localStorage.getItem('finance_tx')) || [
        { id: 1, description: "Stipend - Golden Wise", amount: 650, type: "income" },
        { id: 2, description: "Domain registration", amount: 15, type: "expense" }
    ];

    const save = () => localStorage.setItem('finance_tx', JSON.stringify(transactions));

    const draw = () => {
        txList.innerHTML = '';
        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(tx => {
            const item = document.createElement('div');
            item.className = `tx-item ${tx.type}`;
            item.innerHTML = `
                <div class="tx-info">
                    <span class="tx-desc">${escapeHTML(tx.description)}</span>
                    <span class="tx-cat">${tx.type.toUpperCase()}</span>
                </div>
                <div>
                    <span class="tx-amount">${tx.type === 'income' ? '+' : '-'}$${tx.amount.toFixed(2)}</span>
                    <button class="tx-delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;

            if (tx.type === 'income') {
                totalIncome += tx.amount;
            } else {
                totalExpenses += tx.amount;
            }

            item.querySelector('.tx-delete').onclick = () => {
                transactions = transactions.filter(t => t.id !== tx.id);
                save();
                draw();
            };

            txList.appendChild(item);
        });

        // Totals Calculations
        const balance = totalIncome - totalExpenses;
        balText.textContent = `${balance < 0 ? '-' : ''}$${Math.abs(balance).toFixed(2)}`;
        balText.style.color = balance >= 0 ? 'var(--cyan-glow)' : '#ef4444';

        incText.textContent = `$${totalIncome.toFixed(2)}`;
        expText.textContent = `$${totalExpenses.toFixed(2)}`;

        // Savings Rate calculation & SVG Circular animation
        let savingsPct = 0;
        if (totalIncome > 0) {
            savingsPct = Math.max(0, Math.floor((balance / totalIncome) * 100));
        }

        savingsText.textContent = `${savingsPct}%`;

        // SVG circle perimeter is 2 * pi * r (2 * 3.14159 * 22 = 138.2)
        const circumference = 138.2;
        const strokeOffset = (savingsPct / 100) * circumference;
        chartCircle.setAttribute('stroke-dasharray', `${strokeOffset}, ${circumference}`);
    };

    addBtn.onclick = () => {
        const desc = finDesc.value.trim();
        const amt = parseFloat(finAmount.value) || 0;
        const type = finType.value;

        if (!desc || amt <= 0) {
            alert('Please specify a description and a valid positive amount.');
            return;
        }

        transactions.push({
            id: Date.now(),
            description: desc,
            amount: amt,
            type: type
        });

        finDesc.value = '';
        finAmount.value = '';
        save();
        draw();
    };

    draw();
}

// Utility: HTML injection prevention
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}