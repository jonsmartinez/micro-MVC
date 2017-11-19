/*

    L.A.Va (LIVE Argument Validator)

    File name: lava.js (Version: 1.0)
    Description: This file contains the L.A.Va - LIVE Argument Validator.

    Coded by George Delaportas (G0D) 
    Copyright (C) 2016
    Open Software License (OSL 3.0)

*/

// L.A.Va
function lava()
{
    // Informative log for the programmer
    function info_log(message)
    {
        console.log('---------- L.A.Va ----------');
        console.log(message);
        console.log('---------- ****** ----------');
        console.log('');
    }

    // Scan for unknown keywords
    function has_unknown_keywords(definition_model)
    {
        var __index = null,
            __attribute = null,
            __option = null;

        for (__index in definition_model)
        {
            __attribute = definition_model[__index];

            if (!utils.validation.misc.is_object(__attribute))
            {
                if (__def_keywords.indexOf(__index) === -1)
                    return true;

                continue;
            }

            for (__option in __attribute)
            {
                if (__def_keywords.indexOf(__option) === -1)
                    return true;

                if (has_unknown_keywords(__attribute[__option]))
                    return true;
            }
        }

        return false;
    }

    // Define the JSON object
    this.define = function(definition_model)
    {
        if (!utils.validation.misc.is_array(definition_model))
        {
            info_log('Not a valid definition model!');

            return false;
        }

        if (definition_model.length === 0)
        {
            info_log('The definition model is null!');

            return false;
        }

        if (has_unknown_keywords(definition_model))
        {
            info_log('The definition model contains unknown keywords!');

            return false;
        }

        var __this_key = null,
            __this_value = null;

        __is_model_defined = false;

        for (__counter = 0; __counter < definition_model.length; __counter++)
        {
            if (!utils.validation.misc.is_object(definition_model[__counter]))
            {
                info_log('Invalid JSON object in the model!');

                return false;
            }

            if (!definition_model[__counter].hasOwnProperty('key') || !definition_model[__counter].hasOwnProperty('value'))
            {
                info_log('Missing "key" or "value" mandatory attributes!');

                return false;
            }

            __this_key = definition_model[__counter].key;
            __this_value = definition_model[__counter].value;

            if (!utils.validation.misc.is_object(__this_key) || !utils.validation.misc.is_object(__this_value))
            {
                info_log('A "key" or "value" attribute does not point to a JSON object!');

                return false;
            }

            if (!__this_key.hasOwnProperty('id') || !__this_key.hasOwnProperty('optional'))
            {
                info_log('Missing "id" or "optional" mandatory properties!');

                return false;
            }

            if (!utils.validation.alpha.is_string(__this_key.id) || !utils.validation.misc.is_bool(__this_key.optional))
            {
                info_log('Invalid specification for "id" or "optional" property!');

                return false;
            }

            if (utils.validation.misc.is_invalid(__this_key.id) || document.getElementById(__this_key.id) === null)
            {
                info_log('The "id" points to no HTML element!');

                return false;
            }

            if (!__this_value.hasOwnProperty('type'))
            {
                info_log('Missing "type" mandatory property!');

                return false;
            }

            if (!utils.validation.alpha.is_string(__this_value.type) || __all_value_types.indexOf(__this_value.type) === -1)
            {
                info_log('Invalid specification for "type" property!');

                return false;
            }

            if (__this_value.hasOwnProperty('length'))
            {
                if (__uncountable_value_types.indexOf(__this_value.type) !== -1)
                {
                    info_log('This type does not support the "length" option!');

                    return false;
                }

                if (!utils.validation.numerics.is_integer(__this_value.length) || __this_value.length < 1)
                {
                    info_log('The "length" option has to be a positive integer!');

                    return false;
                }
            }

            if (__this_value.hasOwnProperty('regex'))
            {
                if (__uncountable_value_types.indexOf(__this_value.type) !== -1 || __this_value.type === 'array')
                {
                    info_log('This type does not support the "regex" option!');

                    return false;
                }

                if (utils.validation.misc.is_invalid(__this_value.regex))
                {
                    info_log('Invalid "regex" option!');

                    return false;
                }
            }
        }

        __is_model_defined = true;
        __json_def_model = definition_model;

        return true;
    };

    // Validate all fields based on the definition model
    this.validate = function()
    {
        if (!__is_model_defined)
        {
            info_log('No definition model was specified!');

            return false;
        }

        var __this_key = null,
            __this_value = null,
            __this_field = null,
            __keys_found = 0,
            __keys_optional = false;

        for (__counter = 0; __counter < __json_def_model.length; __counter++)
        {
            __this_key = __json_def_model[__counter].key;
            __this_field = document.getElementById(__this_key.id);

            if (__this_field === null)
            {
                info_log('Element: "' + __this_key.id + '" does not exit!');

                return false;
            }

            if (__this_key.optional === true)
                __keys_optional = true;

            __keys_found++;
        }

        if (__keys_found < __json_def_model.length && __keys_optional === false)
        {
            info_log('Defined non-optional elements differ from that on the page!');

            return false;
        }

        for (__counter = 0; __counter < __json_def_model.length; __counter++)
        {
            __this_key = __json_def_model[__counter].key;
            __this_value = __json_def_model[__counter].value;
            __this_field = document.getElementById(__this_key.id);

            if (__this_field === null && __keys_optional === true)
                continue;

            if (__this_value.type !== '*')
            {
                if (__this_value.type === 'null')
                {
                    if (__this_field.value !== null)
                    {
                        info_log('Field: "' + __this_field.id + '" accepts only "null" values!');

                        return false;
                    }
                }
                else if (__this_value.type === 'array')
                {
                    if (!utils.validation.misc.is_array(__this_field.value))
                    {
                        info_log('Field: "' + __this_field.id + '" accepts only "array" values!');

                        return false;
                    }
                }
                else
                {
                    if (typeof __this_field.value !== __this_value.type)
                    {
                        info_log('Field: "' + __this_field.id + '" has a type mismatch!');

                        return false;
                    }
                }
            }

            if (__this_value.hasOwnProperty('length'))
            {
                if (__this_value.type === 'array')
                {
                    if (__this_field.value.length > __this_value.length)
                    {
                        info_log('Field: "' + __this_field.id + '" has exceeded the defined length!');

                        return false;
                    }
                }
                else
                {
                    if (__this_field.value.toString().length > __this_value.length)
                    {
                        info_log('Field: "' + __this_field.id + '" has exceeded the defined length!');

                        return false;
                    }
                }
            }

            if (__this_value.hasOwnProperty('regex'))
            {
                if (!utils.validation.utilities.reg_exp(__this_value.regex, __this_field.value))
                {
                    info_log('Field: "' + __this_field.id + '" has not matched the specified regex!');

                    return false;
                }
            }
        }

        return true;
    };

    // Define and validate at once
    this.verify = function(definition_model)
    {
        if (self.define(definition_model))
            return self.validate();

        return false;
    };

    var self = this,
        __is_model_defined = false,
        __counter = 0,
        __json_def_model = null,
        __def_keywords = ['key', 'value', 'id', 'optional', 'type', 'length', 'regex'],
        __all_value_types = ['number', 'string', 'boolean', 'array', 'object', 'function', 'null', '*'],
        __uncountable_value_types = ['boolean', 'object', 'function', 'null', '*'],
        utils = new vulcan();
}
