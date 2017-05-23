var tabcontent, tablinks;
tabcontent = document.getElementsByClassName('tabcontent');
tablinks = document.getElementsByClassName('tablinks');

function openTab(evt, choosenTab) {
  // Declare all variables
  var i;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(choosenTab).style.display = 'block';
  evt.currentTarget.className += ' active';
}

function closeTab() {
  var closeXs;
  closeX = document.getElementsByClassName('fa-times');

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
}
