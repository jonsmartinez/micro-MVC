<?php
    /*
        spl@sh (Class)

        File name: click.php (Version: 4.4)
        Description: This file contains the "Server - MOUSE CLICK" actions.

        Coded by George Delaportas (G0D)
        Copyright (C) 2013
        Open Software License (OSL 3.0)
    */

    /* ------------------------ BEGIN ------------------------ */

    function Server_Mouse_Click($params)
    {

        $message = HELPERS::Parse_Event_Parameters($params);

        if ($message === false)
            return false;

        echo $message;

        return true;

    }

    /* ------------------------- END ------------------------- */
?>
