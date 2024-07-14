document.addEventListener("DOMContentLoaded", function() {
    // Get all action buttons
    const buttons = document.querySelectorAll(".action-buttons");

    // Add click event listener to each button
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const buttonId = this.id;
            console.log(`Button with ID ${buttonId} clicked.`);
            switch (buttonId) {
                case "chatButton":
                    window.location.href = "chat/index.html";
                    break;
                case "audioCallButton":
                    alert("audioCallButton")
                    break;
                case "videoCallButton":
                    alert("videoCallButton")
                    break;
                case "screenShareButton":
                    alert("screenShareButton")
                    break;
                default:
                    break;
            }
        });
    });
});
