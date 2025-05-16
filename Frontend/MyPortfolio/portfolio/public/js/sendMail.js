$(document).ready(function () {
    $('#emailForm').on('submit', function (event) {
      event.preventDefault();
  
      const title = $('#title').val();
      const name = $('#name').val();
      const email = $('#email').val();
      const text = $('#text').val();
      const mailtoLink = `mailto:kybra.korkmaz@gmail.com?subject=${encodeURIComponent(title)}
      &body=Name: ${encodeURIComponent(name)}
      %0AEmail: ${encodeURIComponent(email)}
      %0A%0A${encodeURIComponent(text)}`;

    // Redirect the user to the mailto link
      window.location.href = mailtoLink;
    });
  });