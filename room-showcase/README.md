# The Serenity Ridge — Visiting Card Room Showcase & Direct Phone Booking Portal

A human-designed, mobile-first room showcase and marketing landing page tailored specifically for clients who scan a **QR code on your visiting card**.

---

## 🌟 How the Guest Journey Works

1. **Guest receives physical visiting card** with your QR Code.
2. **Guest scans QR code** using their smartphone camera.
3. **Streamlined showcase opens**:
   - Clean Hero header with property branding.
   - Directly displays the Room Showcase grid with photos and room specs.
   - Every room highlights: **Beds**, **Attached Bathroom**, **Kitchen**, and **Split AC**.
   - Sticky 1-tap **"Call Admin to Book"** bar at the bottom of mobile screens.
4. **Guest taps to call**:
   - Direct dial (`tel:...`) connects the guest immediately to your phone to confirm room availability and lock dates.

---

## 📁 Folder Structure

```
room-showcase/
├── index.html              # Clean semantic HTML5 landing page (Hero + Rooms + Modal)
├── css/
│   └── styles.css          # Fully responsive layout (mobile, tablet, laptop)
├── js/
│   ├── config.js           # Central configuration: Phone, Rooms, Beds, Baths & Pricing
│   └── app.js              # Dynamic room cards & detailed modal logic
├── assets/
│   └── images/
│       ├── hero.jpg        # Resort exterior / entrance hero background
│       ├── room-1.jpg      # Deluxe Twin Suite (2 Beds)
│       ├── room-2.jpg      # Executive Balcony Suite with Kitchen
│       ├── room-3.jpg      # Garden Villa (Attached Bath & Kitchen)
│       ├── room-4.jpg      # Family Skyline Penthouse (2 Large Beds)
│       └── host.jpg        # Manager portrait
└── README.md
```

---

## ⚙️ How to Customize in 60 Seconds

### 1. Update Admin Phone Number
Open `js/config.js` and edit the `admin` section:
```javascript
admin: {
  name: "Reservations Desk",
  phoneDisplay: "+91 98765 43210",   // Displayed text on website
  phoneDial: "+919876543210",        // Direct tel: dialing format
  statusText: "Online & Ready to Book"
}
```

### 2. Add Your Real Room Photos
Whenever you have real photos of your property:
1. Save your photos as `room-1.jpg`, `room-2.jpg`, `room-3.jpg`, `room-4.jpg`, `hero.jpg`.
2. Paste them into `room-showcase/assets/images/` to immediately replace the sample photos!

### 3. Change Room Prices & Specs
In `js/config.js`, modify any room inside `HOTEL_CONFIG.rooms`:
- Change `beds`: e.g. `"2 Queen Beds"`
- Change `bathroom`: e.g. `"Private Attached Bathroom with Hot Water"`
- Change `kitchen`: e.g. `"Equipped Kitchenette (Fridge, Induction, Kettle)"`
- Change `ac`: e.g. `"Split Inverter AC"`
- Change `priceLabel`: e.g. `"₹4,200"`

---

## 🚀 How to Run Locally

```bash
# Using Node
node serve.js
```
Then visit `http://localhost:4173/` in your browser.
