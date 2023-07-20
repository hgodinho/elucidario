<?php

/**
 * Digital class.
 * 
 * DigitalObject, utilizado para CRUD.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Model\Entities;

if (!defined('ABSPATH')) exit;

if (!defined('LCDR_PATH')) exit;

final class Digital {
    /**
     * Digital ID.
     *
     * @var int
     */
    public $ID = 0;

    /**
     * The Digital's label.
     *
     * @var string
     */
    public $label = '';

    /**
     * The Digital's uri.
     *
     * @var string
     */
    public $uri = '';

    /**
     * The Digital's identifications.
     *
     * @var array
     */
    public $identified_by = [];

    /**
     * The Digital's descriptions.
     *
     * @var array
     */
    public $referred_to_by = [];

    /**
     * The Digital's equivalent resources.
     *
     * @var array
     */
    public $equivalent = [];

    /**
     * The Digital's attribution
     *
     * @var array
     */
    public $attributed_by = [];

    /**
     * The Digital's dimension.
     *
     * @var array
     */
    public $dimension = [];

    /**
     * The Digital's format.
     *
     * @var string
     */
    public $format = '';

    /**
     * The Digital's availability.
     *
     * @var array
     */
    public $digitally_available_via = [];

    /**
     * The Digital's uses.
     *
     * @var array
     */
    public $used_for = [];

    /**
     * The Digital's creation.
     *
     * @var array
     */
    public $creation = \LCDR\Model\Classes\Creation::class;

    /**
     * The Digital's representations.
     *
     * @var array
     */
    public $representation = [];

    /**
     * The Digital's classifications.
     *
     * @var array
     */
    public $classified_as = [];

    /**
     * The Digital's parts.
     *
     * @var array
     */
    public $part_of = [];

    /**
     * The Digital's Sets.
     *
     * @var array
     */
    public $member_of = [];

    /**
     * The Digital's subjects.
     *
     * @var array
     */
    public $subject_of = [];

    // /**
    //  * The post's status.
    //  * @todo ver necessidade
    //  * @var string
    //  */
    // public $post_status = 'publish';

    // /**
    //  * Whether comments are allowed.
    //  *@todo ver necessidade
    //  * @var string
    //  */
    // public $comment_status = 'open';

    // /**
    //  * Whether pings are allowed.
    //  * @todo ver necessidade
    //  * @var string
    //  */
    // public $ping_status = 'open';

    // /**
    //  * The post's password in plain text.
    //  * @todo ver necessidade
    //  * @var string
    //  */
    // public $post_password = '';

    // /**
    //  * The post's slug.
    //  *
    //  * @var string
    //  */
    // public $post_name = '';

    // /**
    //  * URLs queued to be pinged.
    //  * @todo ver necessidade
    //  * @var string
    //  */
    // public $to_ping = '';

    // /**
    //  * URLs that have been pinged.
    //  * @todo ver necessidade
    //  * @var string
    //  */
    // public $pinged = '';

    // /**
    //  * Cached comment count.
    //  *
    //  * A numeric string, for compatibility reasons.
    //  *
    //  * @var string
    //  */
    // public $comment_count = 0;
}
