import React from 'react';

const Footer = () => (
    <footer>
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <ul className="footer-nav">
                        <li>One University Plaza</li>
                        <li>Youngstown, OH 44555</li>
                        <li>330.941.3000</li>
                        <li>
                            <a href="mailto:gradcollege@ysu.edu">gradcollege@ysu.edu</a>
                        </li>
                        <li></li>
                    </ul>
                </div>
                <div className="col-md-6">
                    <ul className="social-links">
                        <li>
                            <a href="https://www.facebook.com/YSUGradStudies/" target="_blank"><i className="icon ion-logo-facebook"></i></a>
                        </li>
                        <li>
                            <a href="https://twitter.com/ysugradcollege" target="_blank"><i className="icon ion-logo-twitter"></i></a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/groups/12177012/" target="_blank"><i className="icon ion-logo-instagram"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="row">
            <p>Copyright &copy; 2020 by Youngstown State University. All rights reserved.</p>
        </div>
    </footer>

)

export default Footer;