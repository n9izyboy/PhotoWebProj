(function () {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("formMessage");
      if (msg) {
        msg.textContent = "Thanks. Your inquiry draft is ready (connect backend next).";
      }
    });
  }

  const bookingForm = document.getElementById("bookingForm");
  if (!bookingForm) return;

  const dateInput = document.getElementById("bookingDate");
  const timeSelect = document.getElementById("bookingTime");
  const durationSelect = document.getElementById("bookingDuration");
  const slotList = document.getElementById("slotList");
  const bookingMessage = document.getElementById("bookingMessage");

  const DAILY_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  function getBookedSlotsForDate(date) {
    const raw = localStorage.getItem(`bookedSlots_${date}`);
    return raw ? JSON.parse(raw) : [];
  }

  function setBookedSlot(date, time) {
    const booked = getBookedSlotsForDate(date);
    if (!booked.includes(time)) {
      booked.push(time);
      localStorage.setItem(`bookedSlots_${date}`, JSON.stringify(booked));
    }
  }

  function renderSlots() {
    const date = dateInput.value;
    slotList.innerHTML = "";
    timeSelect.innerHTML = `<option value="">Select time</option>`;

    if (!date) return;

    const booked = getBookedSlotsForDate(date);

    DAILY_SLOTS.forEach((slot) => {
      const isBooked = booked.includes(slot);

      const li = document.createElement("li");
      li.textContent = `${slot} ${isBooked ? "— Booked" : "— Available"}`;
      if (isBooked) li.classList.add("booked");
      slotList.appendChild(li);

      if (!isBooked) {
        const option = document.createElement("option");
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
      }
    });
  }

  dateInput.addEventListener("change", renderSlots);

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const date = dateInput.value;
    const time = timeSelect.value;
    const duration = durationSelect.value;

    if (!name || !email || !date || !time || !duration) {
      bookingMessage.textContent = "Please complete all booking fields.";
      return;
    }

    setBookedSlot(date, time);

    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    allBookings.push({
      name,
      email,
      date,
      time,
      durationMinutes: Number(duration),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("bookings", JSON.stringify(allBookings));

    bookingMessage.textContent = `Booked: ${date} at ${time} for ${duration} minutes. Your slot is secured.`;
    bookingForm.reset();
    dateInput.min = today;
    renderSlots();
  });
})();
