<?php


    /*

        localhost Ltd - spl@sh

        Version: 4.2

        File name: multimedia.php
        Description: This file contains the "MULTIMEDIA" abstract class.

        Coded by George Delaportas (G0D)

        localhost Ltd
        Copyright © 2013

    */



    /* ------------------------ BEGIN ------------------------ */

    // Include CONTROL class
    require_once(UTIL::Absolute_Path('framework/extensions/php/splash/classes/control.php'));

    // Utility: [MULTIMEDIA]
    abstract class MULTIMEDIA extends CONTROL
    {

        // Attributes
        protected $__attr_src = null;

        // Events
        protected $__event_focus = null;
        protected $__event_blur = null;
        protected $__event_abort = null;

    }

    /* ------------------------- END ------------------------- */

?>
