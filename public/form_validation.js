
    $('#signup-form').submit(function(event) {
        if ($('#password').val() !== $('#r-password').val()) {
            alert('Passwords do not match.')
            event.preventDefault()
        }
    })
    