var tabcontent, tablinks;
tabcontent = document.getElementsByClassName('tabcontent');
tablinks = document.getElementsByClassName('tablinks');

function openTab(evt, choosenTab) {
  var ifOpenedAtBegin = false;
  if (document.getElementById(choosenTab).style.display === 'block') {
    ifOpenedAtBegin = true;
  }

  // Declare all variables
  var i;

  // Get all elements with class="tabcontent" and hide them
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Get all elements with class="tablinks" and remove the class "active"
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');

  }

  document.getElementById(choosenTab).classList.add('shown');

  // Show the current tab, and add an "active" class to the button that opened the tab
  if (!ifOpenedAtBegin) {
    document.getElementById(choosenTab).style.display = 'block';
    evt.currentTarget.className += ' active';
  }
}
