<?php

/**
 * Retorna string para ser utilizada como handle dos hooks action ou filter
 *
 * @param array $names Nomes.
 * @return string
 */
function lcdr_hook(array $names) {
    $hook = array_merge(array('lcdr'), $names);
    return implode('_', $hook);
}
