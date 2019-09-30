import React from 'react';

const Footer = () => (
    <footer>
        <div className="container">
            <div class="row">
                <div class="col-md-6">
                    <ul class="footer-nav">
                        <li>One University Plaza</li>
                        <li>Youngstown, OH 44555</li>
                        <li>330.941.3000</li>
                        <li>
                            <a href="mailto:gradcollege@ysu.edu">gradcollege@ysu.edu</a>
                        </li>
                        <li></li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <ul class="social-links">
                        <li>
                            <a href="#"><i class="icon ion-logo-facebook"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="icon ion-logo-twitter"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="icon ion-logo-googleplus"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="icon ion-logo-instagram"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>    
         <div class="row">
             <p>Copyright &copy; 2019 by Youngstown State University. All rights reserved.</p>
         </div>
     </footer>
    
)

export default Footer;