<?php
    /*
        MS SQL

        Version: 1.2
        File name: ms_sql.php
        Description: This file contains the "MS SQL" extension.

		Coded by George Delaportas (ViR4X)
		Copyright (C) 2017
		Open Software License (OSL 3.0)
    */

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();

    // MS SQL class
    class MS_SQL
    {
        // Shared database connection
        private static $__db_con = null;

        // Connect to the database
        public static function Connect($user, $pass, $server_name, $db = '')
        {
            ini_set('mssql.charset', 'UTF-8');

            $conn_params = array('Database' => $db, 'UID' => $user, 'PWD' => $pass);
            $mssql_con = sqlsrv_connect($server_name, $conn_params);

            if ($mssql_con === false)
                return false;

            self::$__db_con = $mssql_con;

            return self::$__db_con;
        }

        // Disconnect from the database
        public static function Disconnect($connection_id)
        {
            if (empty($connection_id))
                return false;

            $mssql_dis = sqlsrv_close($connection_id);

            if ($mssql_dis === false)
                return false;

            self::$__db_con = null;

            return true;
        }

        // Execute SQL commands
        public static function Exec_SQL_Command($sql_com)
        {
            $mssql_result =  sqlsrv_query(self::$__db_con, $sql_com);

            if ($mssql_result === false)
                return false;

            $final_result = array();

            if (!is_bool($mssql_result))
            {
                while ($mssql_row = sqlsrv_fetch_array($mssql_result))
                    $final_result[] = $mssql_row;
            }

            return $final_result;
        }

        // Execute SQL script files
        public static function Exec_SQL_Script($sql_file)
        {
            if (empty($sql_file))
                return false;

            $mssql_query = '';
            $mssql_result = array();

            while (!feof($file_handler))
            {
                $this_line = fgets($file_handler);

                if (trim($this_line) != '' && strpos($this_line, '--') === false)
                {
                    $mssql_query .= $this_line;

                    if (preg_match("/;[\040]*\$/", $this_line))
                    {
                        $mssql_result = self::Exec_SQL_Command($mssql_query);

                        $mssql_query = '';
                    }
                }
            }

            fclose($file_handler);

            return $mssql_result;
        }
    }
?>
