$(document).ready(function() {
  var header = $('.Header');

  $(header).click(function (e) {
    e.preventDefault();
	  $('nav').toggleClass('is-active');
   });
});
