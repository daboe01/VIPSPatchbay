/*
 * NotifyingMutableDictionary.j
 * VIPS Patchbay
 *
 * Created by Daniel Boehringer in August, 2025.
 * Copyright 2025, All rights reserved.
 */

@implementation NotifyingMutableDictionary : CPMutableDictionary
{
    id _delegate;
}

- (void)setDelegate:(id)aDelegate
{
    _delegate = aDelegate;
}

- (id)delegate
{
    return _delegate;
}

- (void)setObject:(id)anObject forKey:(id)aKey
{
    var old = [self objectForKey:aKey];

    [super setObject:anObject forKey:aKey];

    if (old != anObject && [_delegate respondsToSelector:@selector(dictionaryDidChange:)])
        [_delegate dictionaryDidChange:self];
}

- (void)removeObjectForKey:(id)aKey
{
    [super removeObjectForKey:aKey];
    if ([_delegate respondsToSelector:@selector(dictionaryDidChange:)])
        [_delegate dictionaryDidChange:self];
}

- (void)addEntriesFromDictionary:(CPDictionary)otherDictionary
{
    [super addEntriesFromDictionary:otherDictionary];
    if ([_delegate respondsToSelector:@selector(dictionaryDidChange:)])
        [_delegate dictionaryDidChange:self];
}

- (void)removeAllObjects
{
    [super removeAllObjects];
    if ([_delegate respondsToSelector:@selector(dictionaryDidChange:)])
        [_delegate dictionaryDidChange:self];
}

- (void)setValue:(id)value forKey:(CPString)key
{
    [self setObject:value forKey:key];
}

@end
