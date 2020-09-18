$('#changePassword').click(()=>{
    $('#changePasswordDiv').removeClass('d-none');
    $('#changePassword').addClass('d-none');
});

$('#cancelChangePassword').click(()=>{
    $('#changePasswordDiv').addClass('d-none');
    $('#changePassword').removeClass('d-none');
});

