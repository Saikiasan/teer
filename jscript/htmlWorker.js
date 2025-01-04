export const htmlHead = (pageTitle) => {
  // let iconPath = "favicon.ico";
  let bootstrapCssPath = "lib/bootstrap/css/bootstrap.min.css";
  const title = $('<title>').text(pageTitle);
  const metaScale = ('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  const metaUTF = ('<meta charset="UTF-8">');
  // const linkIcon = $('<link>').attr('rel','stylesheet').attr('href',iconPath);
  const linkBootstrapCss = $('<link>').attr({'rel':'stylesheet','href':'lib/bootstrap/css/bootstrap.min.css'});
  const linkFAIconCss = $('<link>').attr({'rel':'stylesheet','href':'lib/font-awesome/css/font-awesome.min.css'});
  const styles = $('<style>').text(`.navbar-toggler {
    border: none !important;
    box-shadow: none !important;
    font-size: 2em;
  }`);

  return[metaUTF, metaScale, linkBootstrapCss,linkFAIconCss, title,styles]
}

export const navigation = (brand) => {
  const buttonState = "bars";
  const navbar = $('<nav>').addClass('navbar navbar-expand-lg bg-body-tertiary');
  const containerFluid = $('<div>').addClass('container-fluid');
  const navbarBrand = $('<a>').addClass('navbar-brand').attr('href', '#').text(brand);
  const navbarToggler = $('<button>').addClass('navbar-toggler').attr({
    'type': 'button',
    'data-bs-toggle': 'collapse',
    'data-bs-target': '#navbarNavDropdown',
    'aria-controls': 'navbarNavDropdown',
    'aria-expanded': 'false',
    'aria-label': 'Toggle navigation'
  }).append($('<span>').addClass(`fa fa-bars`));

  navbarToggler.on('click',function(){
    $(this).find('span').toggleClass('fa-bars fa-close');
  });
  
  const collapseNavbar = $('<div>').addClass('collapse navbar-collapse').attr('id', 'navbarNavDropdown');
  const navList = $('<ul>').addClass('navbar-nav');
  const homeNavItem = $('<li>').addClass('nav-item').append($('<a>').addClass('nav-link active').attr('aria-current', 'page').attr('href', '#').text('Home'));
  const featuresNavItem = $('<li>').addClass('nav-item').append($('<a>').addClass('nav-link').attr('href', '#').text('Features'));
  const pricingNavItem = $('<li>').addClass('nav-item').append($('<a>').addClass('nav-link').attr('href', '#').text('Pricing'));
  const dropdownNavItem = $('<li>').addClass('nav-item dropdown').append($('<a>').addClass('nav-link dropdown-toggle').attr({
      'href': '#',
      'role': 'button',
      'data-bs-toggle': 'dropdown',
      'aria-expanded': 'false'
    }).text('Dropdown link'), $('<ul>')
    .addClass('dropdown-menu').append($('<li>').append($('<a>').addClass('dropdown-item')
      .attr('href', '#').text('Action')), $('<li>').append($('<a>').addClass('dropdown-item')
      .attr('href', '#').text('Another action')), $('<li>').append($('<a>').addClass('dropdown-item')
      .attr('href', '#').text('Something else here'))));
  navList.append(homeNavItem, featuresNavItem, pricingNavItem, dropdownNavItem);
  collapseNavbar.append(navList);
  containerFluid.append(navbarBrand, navbarToggler, collapseNavbar);
  navbar.append(containerFluid);

  return navbar;
}

export const banner = () => {
  const banner = $('<div>').addClass('')
}