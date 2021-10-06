let deleteButton = document.querySelectorAll('.btn-delete');

deleteButton.forEach(node => node.addEventListener("click", function(e) {

    e.preventDefault();

    if(confirm('Ar tikrai norite pašalinti šią kompaniją?')) 
        window.location = node.getAttribute('href');
}));


