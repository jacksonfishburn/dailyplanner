import React from 'react';
import './about.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function About() {
  return (
    <div className='about-container'>
      <div className="d-flex justify-content-center align-items-center">
        <div className="container position-relative"  style={{zIndex: 1}}>
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="p-4 p-md-5 fw-semibold fs-5 text-white text-center">
                <p className="mb-0">
                  Plan My Day is an easy to use todo app with seamless day-to-day scheduling tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
