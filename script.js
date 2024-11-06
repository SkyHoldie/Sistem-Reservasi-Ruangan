class Room {
    constructor(id, name, capacity) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.remainingCapacity = capacity;
        this.reservations = [];
    }

    // Memeriksa apakah ruangan tersedia pada tanggal dan waktu tertentu
    isAvailable(date, time) {
        return (
            this.remainingCapacity > 0 &&
            !this.reservations.some(reservation => reservation.date === date && reservation.time === time)
        );
    }

    addReservation(reservation) {
        if (this.remainingCapacity > 0) {
            this.reservations.push(reservation);
            this.remainingCapacity--; // Kurangi kapasitas yang tersisa
        }
    }

    removeReservation(reservationId) {
        const reservationIndex = this.reservations.findIndex(reservation => reservation.id === reservationId);
        if (reservationIndex !== -1) {
            this.reservations.splice(reservationIndex, 1);
            this.remainingCapacity++; // Tambah kapasitas yang tersisa
        }
    }
}

class Reservation {
    constructor(id, roomId, date, time, name) {
        this.id = id;
        this.roomId = roomId;
        this.date = date;
        this.time = time;
        this.name = name;
    }
}

const rooms = [
    new Room(1, 'Conference Room A', 10),
    new Room(2, 'Conference Room B', 15),
    new Room(3, 'Meeting Room C', 5)
];

let reservationIdCounter = 1;

/* Fungsi untuk menambahkan reservasi baru */
function addNewReservation(roomId, date, time, name) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
        alert("Room not found.");
        return;
    }

    if (!room.isAvailable(date, time)) {
        alert("Room is already booked at the selected date and time.");
        return;
    }

    const newReservation = new Reservation(reservationIdCounter++, roomId, date, time, name);
    room.addReservation(newReservation);

    // Tambahkan animasi highlight pada form saat berhasil
    const form = document.getElementById('reservation-form');
    form.classList.add('highlight');
    setTimeout(() => form.classList.remove('highlight'), 1000);

    alert("Reservation added successfully.");
    renderRooms(); // Perbarui daftar ruangan
    renderReservations(); // Perbarui daftar reservasi
}

/* Fungsi untuk menampilkan daftar ruangan */
function renderRooms() {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = "<h3>Room List</h3>";

    rooms.forEach(room => {
        const roomElement = document.createElement('div');
        
        const statusText = room.remainingCapacity > 0 
            ? `Available - Remaining Capacity: ${room.remainingCapacity}`
            : "Not Available - Full Capacity";

        roomElement.innerHTML = `
            <strong>${room.name}</strong> (Capacity: ${room.capacity}) - ID: ${room.id}
            <br>Status: <span class="${room.remainingCapacity > 0 ? 'available' : 'not-available'}">${statusText}</span>
        `;

        roomList.appendChild(roomElement);
    });
}

/* Fungsi untuk menampilkan daftar reservasi */
function renderReservations() {
    const reservationTableBody = document.getElementById('reservation-table-body');
    reservationTableBody.innerHTML = ''; // Kosongkan tabel sebelum menampilkan data baru

    let reservationCount = 1;

    rooms.forEach(room => {
        room.reservations.forEach(reservation => {
            const row = document.createElement('tr');
            row.classList.add('fade-in'); // Animasi fade-in

            row.innerHTML = `
                <td>${reservationCount++}</td>
                <td>${room.name}</td>
                <td>${reservation.date}</td>
                <td>${reservation.time}</td>
                <td>${reservation.name}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="cancelReservation(${reservation.id}, ${room.id}, this)">Cancel</button>
                </td>
            `;
            reservationTableBody.appendChild(row);
        });
    });
}

/* Fungsi untuk menghapus reservasi dengan animasi slide-out */
function cancelReservation(reservationId, roomId, buttonElement) {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
        const row = buttonElement.closest('tr');
        row.classList.add('slide-out');
        setTimeout(() => {
            room.removeReservation(reservationId);
            renderRooms();
            renderReservations();
        }, 500); // Tunggu hingga animasi selesai
    } else {
        alert("Room not found.");
    }
}

/* Fungsi untuk menangani penambahan reservasi dari form */
function handleAddReservation() {
    const roomId = parseInt(document.getElementById('roomId').value);
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const name = document.getElementById('name').value;

    if (roomId && date && time && name) {
        addNewReservation(roomId, date, time, name);
    } else {
        alert("Please fill in all fields.");
    }
}

// Render ruangan dan reservasi saat pertama kali halaman dimuat
renderRooms();
renderReservations();
