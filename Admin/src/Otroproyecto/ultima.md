npm run analyze
PS C:\Users\aleja\Documents\GitHub\SIDCOP_FrontEnd\Admin> npm run analyze                                        

> steex@0.0.0 analyze
> node --max-old-space-size=8192 ./node_modules/@angular/cli/bin/ng build --configuration production --source-map
 && npx source-map-explorer dist/steex/**/*.js                                                                   
⠙ Generating browser application bundles (phase: setup)...    Components styles sourcemaps are not generated when
 styles optimization is enabled.                                                                                 ✔ Browser application bundle generation complete.

Warning: C:/Users/aleja/Documents/GitHub/SIDCOP_FrontEnd/Admin/src/app/account/login/login.component.scss exceede
d maximum budget. Budget 2.05 kB was not met by 743 bytes with a total of 2.79 kB.                               
Warning: C:/Users/aleja/Documents/GitHub/SIDCOP_FrontEnd/Admin/src/app/layouts/sidebar/sidebar.component.scss exc
eeded maximum budget. Budget 2.05 kB was not met by 366 bytes with a total of 2.41 kB.                           
Warning: C:/Users/aleja/Documents/GitHub/SIDCOP_FrontEnd/Admin/src/app/pages/general/departamentos/list/list.comp
onent.scss exceeded maximum budget. Budget 2.05 kB was not met by 1.70 kB with a total of 3.74 kB.               
Warning: C:/Users/aleja/Documents/GitHub/SIDCOP_FrontEnd/Admin/src/app/pages/logistica/bodega/details/details.com
ponent.scss exceeded maximum budget. Budget 2.05 kB was not met by 1.70 kB with a total of 3.74 kB.              
Warning: C:/Users/aleja/Documents/GitHub/SIDCOP_FrontEnd/Admin/src/app/pages/table/gridjs/gridjs.component.scss e
xceeded maximum budget. Budget 2.05 kB was not met by 1.25 kB with a total of 3.30 kB.                           
Warning: C:/Users/aleja/Documents/GitHub/SIDCOP_FrontEnd/Admin/src/app/pages/ui/button/button.component.scss exce


Error: C:/Users/aleja/Documents/GitHub/SIDCOP_FrontEnd/Admin/src/app/pages/ui/button/button.component.scss exceed
ed maximum budget. Budget 4.10 kB was not met by 3.62 kB with a total of 7.71 kB.                                

