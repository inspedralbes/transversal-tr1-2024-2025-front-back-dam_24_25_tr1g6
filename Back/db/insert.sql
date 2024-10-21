-- Insert users
INSERT INTO
    usuari (
        Nom,
        Correu,
        Contrasenya,
        Targeta
    )
VALUES (
        'User1',
        'a21rublormar@inspedralbes.cat',
        'password1',
        '1234567812345678'
    ),
    (
        'User2',
        'a23marclacas@inspedralbes.cat',
        'password2',
        '2345678923456789'
    ),
    (
        'User3',
        'a18marcastru@inspedralbes.cat',
        'password3',
        '3456789034567890'
    ),
    (
        'User4',
        'a22arnmaljoa@inspedralbes.cat',
        'password4',
        '4567890145678901'
    );

-- Insert products (juices)
INSERT INTO
    producte (
        nomProducte,
        Descripcio,
        Preu,
        Stock,
        Imatge
    )
VALUES (
        'Orange Juice',
        'Freshly squeezed orange juice',
        3.50,
        100,
        'http://example.com/orange_juice.jpg'
    ),
    (
        'Apple Juice',
        '100% pure apple juice',
        2.75,
        150,
        'http://example.com/apple_juice.jpg'
    ),
    (
        'Grape Juice',
        'Organic grape juice',
        4.00,
        80,
        'http://example.com/grape_juice.jpg'
    ),
    (
        'Pineapple Juice',
        'Tropical pineapple juice',
        3.25,
        120,
        'http://example.com/pineapple_juice.jpg'
    );