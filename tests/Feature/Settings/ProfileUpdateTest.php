<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('profile page is displayed', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->get('/settings/profile');
    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->post(route('profile.update'), [
        'name' => 'Test User',
        'email' => $user->email,
    ]);
    $response->assertSessionHasNoErrors()->assertRedirect('/settings/profile');
    $user->refresh();
    expect($user->name)->toBe('Test User');
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $response = $this->actingAs($user)->post(route('profile.update'), [
        'name' => 'Test User',
        'email' => $user->email,
    ]);
    $response->assertSessionHasNoErrors()->assertRedirect('/settings/profile');
    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->delete(route('profile.destroy'), [
        'password' => 'password',
    ]);
    $response->assertSessionHasNoErrors()->assertRedirect('/');
    expect(User::find($user->id))->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->delete(route('profile.destroy'), [
        'password' => 'wrong-password',
    ]);
    $response->assertSessionHasErrors('password');
});
