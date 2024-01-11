import User, { UserModel } from "@/models/schema/User";
import bcrypt from "bcrypt";

export enum DuplicateCheck {
  EMAIL = 1,
  USERNAME = 2,
  BOTH_USERNAME_EMAIL = 3,
}

/**
 * This code defines a `UserService` class that provides various methods for user authentication and management. It uses the `User` model and external libraries like `bcrypt` for password hashing and `jwt` for token encoding and decoding.
 *
 * Example Usage:
 *
 * const userService = new UserService(userModel, DuplicateCheck.BOTH_USERNAME_EMAIL);
 *
 * // Sign in with username and password
 * const user = await userService.simple_signIn("john_doe", "password");
 * // Output: User object
 *
 * // Sign in with email and password
 * const user = await userService.simple_signIn("john@example.com", "password");
 * // Output: User object
 *
 * // Sign up a new user
 * const newUser: User = {
 *   email: "jane@example.com",
 *   username: "jane_doe",
 *   password: "password",
 *   roles: ["user"],
 * };
 * const success = await userService.signUp(newUser);
 * // Output: true if the user is successfully created, false if there is a duplicate email or username
 *
 * // Verify a token
 * const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
 * const result = await userService.verifyToken(token, publicKey, secretKeyHex, ivHex);
 * // Output: { isValid: true, token: "...", email: "...", username: "...", roles: [...] } if the token is valid, { isValid: false } otherwise
 *
 * Code Analysis:
 *
 * Main functionalities:
 * - User sign-in and sign-up
 * - Token encoding and decoding
 * - Token verification
 *
 * Methods:
 * - constructor(userModel: any, duplicateCheck: DuplicateCheck): Initializes the `UserService` with a user model and a duplicate check option.
 * - async simple_signIn(username: string, password: string): Promise<User>: Performs a simple sign-in by username or email and password. Returns the user object if the credentials are correct.
 * - async signIn(username: string, password: string, prtKey: string, secretKeyHex: string, ivHex: string): Promise<SignInReturn>: Performs a sign-in by username and password, and encodes a JWT token. Returns a `SignInReturn` object with the token, email, username, and roles.
 * - async verifyToken(inputToken: string, pubKey: string, secretKeyHex: string, ivHex: string): Promise<SignInReturn & { isValid: boolean }>: Verifies a JWT token and returns a `SignInReturn` object with additional `isValid` field indicating if the token is valid.
 * - async signUp(user: User): Promise<boolean>: Signs up a new user by creating a user object and checking for duplicates. Returns true if the user is successfully created, false otherwise.
 * - private async isDuplicate(user: User): Promise<boolean>: Checks if a user object has duplicate email or username based on the duplicate check option.
 *
 * Fields:
 * - userModel: The user model used for database operations.
 * - duplicateCheck: The option for duplicate check, can be `DuplicateCheck.EMAIL`, `DuplicateCheck.USERNAME`, or `DuplicateCheck.BOTH_USERNAME_EMAIL`.
 */
export class UserService {
  //   constructor(private userModel: any) {}

  /**
   * Creates a new user.
   * @param user - The user object containing the email, username, password, and roles of the user to be created.
   * @returns A promise that resolves to the created user object.
   */
  private async createUser(user: User): Promise<User> {
    try {
      const createdUser = await UserModel.create(user);
      return createdUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  /**
   * Authenticates a user by checking their username and password.
   * @param username - The username of the user trying to sign in.
   * @param password - The password of the user trying to sign in.
   * @returns The authenticated user object.
   * @throws Error if the credentials are incorrect.
   */
  async simple_signIn(username: string, password: string): Promise<User> {
    let user = await UserModel.find().findOne({ username });

    if (!user && username.includes("@")) {
      user = await UserModel.find().findOne({ email: username });
    }

    if (!user) {
      throw new Error("Incorrect credentials");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password.toString()
    );

    if (!passwordMatch) {
      throw new Error("Incorrect credentials");
    }

    return user;
  }

  /**
   * Creates a new user in the system.
   *
   * @param user - The user object containing the email, username, password, and roles of the user to be created.
   * @param duplicateCheck - The type of duplicate check to perform.
   * @returns A boolean value indicating whether the user was successfully created (true) or if the user is a duplicate (false).
   */
  async signUp(user: User, duplicateCheck: DuplicateCheck): Promise<boolean> {
    const isDuplicate = await this.isDuplicate(user, duplicateCheck);

    if (isDuplicate) {
      return false;
    }

    await this.createUser({ ...user });
    return true;
  }

  /**
   * Checks if a user object is a duplicate based on the specified duplicate check type.
   *
   * @param user - The user object to check for duplicates.
   * @param duplicateCheck - The type of duplicate check to perform.
   * @returns A boolean indicating whether a duplicate user is found based on the specified duplicate check type.
   *
   * @example
   * const userService = new UserService(userModel);
   * const user = new User("test@example.com", "testuser", "password", ["admin"]);
   * const isDuplicate = await userService.isDuplicate(user, DuplicateCheck.EMAIL);
   * console.log(isDuplicate); // true or false
   */
  private async isDuplicate(
    user: User,
    duplicateCheck: DuplicateCheck
  ): Promise<boolean> {
    const { email, username } = user;

    let u: User;
    switch (duplicateCheck) {
      case DuplicateCheck.EMAIL:
        u = await UserModel.find().findOne({ email });
        return !!u?._id;

      case DuplicateCheck.USERNAME:
        u = await UserModel.find().findOne({ username });
        return !!u?._id;

      case DuplicateCheck.BOTH_USERNAME_EMAIL:
        u = await UserModel.find().findOne({ $or: [{ email }, { username }] });
        return !!(u?._id || u?._id);

      default:
        return false;
    }
  }
}
