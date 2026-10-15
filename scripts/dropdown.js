const serviceDropdownButton = document.querySelector('.dropdown-toggle');
const serviceDropdown = document.querySelector('.dropdown');
if (serviceDropdownButton && serviceDropdown) {
  serviceDropdownButton.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    serviceDropdown.classList.toggle('open', !expanded);
  });
  document.addEventListener('click', function(event) {
    if (!serviceDropdown.contains(event.target)) {
      serviceDropdownButton.setAttribute('aria-expanded', 'false');
      serviceDropdown.classList.remove('open');
    }
  });
  serviceDropdownButton.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      this.setAttribute('aria-expanded', 'false');
      serviceDropdown.classList.remove('open');
      this.blur();
    }
  });
}
