<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitcd65ea6fed41e67453fbba74f66c4b5e
{
    public static $prefixLengthsPsr4 = array (
        'A' => 
        array (
            'Alagaccia\\LayoutUpload\\' => 23,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Alagaccia\\LayoutUpload\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitcd65ea6fed41e67453fbba74f66c4b5e::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitcd65ea6fed41e67453fbba74f66c4b5e::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitcd65ea6fed41e67453fbba74f66c4b5e::$classMap;

        }, null, ClassLoader::class);
    }
}
