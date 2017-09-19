<?php

/*
 * WordPress helper for jQuery cctt plugin
 * 
 * author: Capelli Carlo
 * license: MIT
 */

namespace cctt;

/*
 * register jQuery plugin
 */
function register() {
    wp_enqueue_script('jquery');

    wp_register_style('cctt-css', plugins_url('jquery.cctt.css', __FILE__));
    wp_enqueue_style('cctt-css');

    wp_register_script('cctt', plugins_url('jquery.cctt.js', __FILE__), array('jquery'));
    wp_enqueue_script('cctt');
}

/*
 * TBD perform PK compression, based on *values* of data
 * each column in PK becomes a key of resulting array
 * 
 * $records: array of arrays, of count > $pk_count
 */
function aggregate_pk_table($records, $pk_count) {
    $recursive = function($c) {
    };
    
    $aa = array();
    $pk = array_pad(array(), $pk_count, null);

    foreach($records as $record) {
        //$vs = array_values($r);
        $i = 0;
        $rr = $aa;
        foreach($record as $value) {
            if ($i < $pk_count) {
                if (!isset($rr[$value]))
                    $rr[$value];
                if ($value != $pk[$i]) {
                    $pk[$i] = $value;
                }
            }
            $i++;
        }
    }
    return $aa;
}
