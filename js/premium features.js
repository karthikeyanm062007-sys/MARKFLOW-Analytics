/* =====================================
   MARKFLOW NOTIFICATION SYSTEM
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const bell = document.getElementById("notificationBell");
    const panel = document.getElementById("notificationPanel");

    const badge = document.getElementById("notificationBadge");
    const unreadCount = document.getElementById("unreadCount");

    const markAllRead = document.getElementById("markAllRead");
    const clearNotifications = document.getElementById("clearNotifications");

    const notificationList = document.getElementById("notificationList");

    if (!bell || !panel) return;

    // Open and close notification panel

    function toggleNotifications(forceState) {

        const isOpen = forceState ?? panel.hidden;

        panel.hidden = !isOpen;

        bell.setAttribute("aria-expanded", String(isOpen));

    }

    bell.addEventListener("click", (event) => {

        event.stopPropagation();

        toggleNotifications();

    });

    // Prevent panel clicks from closing the panel

    panel.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // Close when clicking outside

    document.addEventListener("click", (event) => {

        if (!event.target.closest(".notification-wrapper")) {
            toggleNotifications(false);
        }

    });

    // Close using Escape key

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            toggleNotifications(false);
            bell.focus();
        }

    });

    // Update unread count

    function updateNotificationCount() {

        const unreadItems = notificationList.querySelectorAll(
            ".notification-item.unread"
        ).length;

        unreadCount.textContent = unreadItems;

        badge.textContent = unreadItems;

        badge.hidden = unreadItems === 0;

        markAllRead.disabled = unreadItems === 0;

    }

    // Mark all notifications as read

    markAllRead.addEventListener("click", () => {

        const items = notificationList.querySelectorAll(
            ".notification-item"
        );

        items.forEach((item) => {
            item.classList.remove("unread");
        });

        updateNotificationCount();

    });

    // Clear all notifications

    clearNotifications.addEventListener("click", () => {

        notificationList.innerHTML = `
            <div class="notification-empty">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications available.</p>
            </div>
        `;

        updateNotificationCount();

    });

    // Initial count

    updateNotificationCount();

});